import { DataSource, EntityManager, UpdateQueryBuilder } from "typeorm/"
import { isError } from "types/Result"
import { DEFAULT_STATION_CODE } from "utils/amendments/amendForceOwner/defaultStationCode"
import amendCourtCase from "./amendCourtCase"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"
import insertNotes from "./insertNotes"
import courtCasesByOrganisationUnitQuery from "./queries/courtCasesByOrganisationUnitQuery"
import updateLockStatusToUnlocked from "./updateLockStatusToUnlocked"
import UnlockReason from "types/UnlockReason"
import AuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AuditLogEvent"
import storeAuditLogEvents from "./storeAuditLogEvents"
import getCourtCase from "./getCourtCase"
import getAuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/lib/auditLog/getAuditLogEvent"
import { AUDIT_LOG_EVENT_SOURCE } from "../config"

const reallocateCourtCaseToForce = async (
  dataSource: DataSource | EntityManager,
  courtCaseId: number,
  user: User,
  forceCode: string,
  note?: string
): Promise<void> => {
  // TODO:
  // - Generate TRPR0028 if necessary
  // - Reset triggers on reallocate
  await dataSource.transaction("SERIALIZABLE", async (entityManager): Promise<void> => {
    const events: AuditLogEvent[] = []

    const courtCase = await getCourtCase(entityManager, courtCaseId)

    if (isError(courtCase)) {
      throw courtCase
    }

    if (!courtCase) {
      throw new Error("Failed to reallocate: Case not found")
    }

    const courtCaseRepository = entityManager.getRepository(CourtCase)
    let query = courtCaseRepository.createQueryBuilder().update(CourtCase)
    const newForceCode = `${forceCode}${DEFAULT_STATION_CODE}`
    query.set({ orgForPoliceFilter: newForceCode })
    query = courtCasesByOrganisationUnitQuery(query, user) as UpdateQueryBuilder<CourtCase>
    query.andWhere("error_id = :id", { id: courtCaseId })

    const amendResult = await amendCourtCase(entityManager, { forceOwner: forceCode }, courtCaseId, user)

    if (isError(amendResult)) {
      throw amendResult
    }

    const addNoteResult = await insertNotes(entityManager, [
      {
        noteText: `${user.username}: Case reallocated to new force owner: ${newForceCode}00`,
        errorId: courtCaseId,
        userId: "System"
      }
    ])

    if (isError(addNoteResult)) {
      throw addNoteResult
    }

    if (note) {
      const addUserNoteResult = await insertNotes(entityManager, [
        {
          noteText: note,
          errorId: courtCaseId,
          userId: user.username
        }
      ])

      if (isError(addUserNoteResult)) {
        throw addUserNoteResult
      }
    }

    events.push(
      getAuditLogEvent("information", "Hearing outcome reallocated by user", AUDIT_LOG_EVENT_SOURCE, {
        user: user.username,
        auditLogVersion: 2,
        eventCode: "hearing-outcome.reallocated",
        "New Force Owner": `${newForceCode}00`
      })
    )

    const unlockResult = await updateLockStatusToUnlocked(
      entityManager,
      +courtCaseId,
      user,
      UnlockReason.TriggerAndException,
      events
    )

    if (isError(unlockResult)) {
      throw unlockResult
    }

    const queryResult = await query.execute()?.catch((error: Error) => error)

    if (isError(queryResult)) {
      throw queryResult
    }

    if (!queryResult.affected || queryResult.affected === 0) {
      throw Error("Failed to reallocate case")
    }

    const storeAuditLogResponse = await storeAuditLogEvents(courtCase.messageId, events).catch((error) => error)

    if (isError(storeAuditLogResponse)) {
      throw storeAuditLogResponse
    }
  })
}

export default reallocateCourtCaseToForce

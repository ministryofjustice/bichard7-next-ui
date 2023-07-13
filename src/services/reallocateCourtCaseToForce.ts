import { DataSource, EntityManager, UpdateQueryBuilder, UpdateResult } from "typeorm/"
import { isError } from "types/Result"
import { DEFAULT_STATION_CODE } from "utils/amendments/amendForceOwner/defaultStationCode"
import amendCourtCase from "./amendCourtCase"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"
import insertNotes from "./insertNotes"
import courtCasesByOrganisationUnitQuery from "./queries/courtCasesByOrganisationUnitQuery"
import updateLockStatusToUnlocked from "./updateLockStatusToUnlocked"
import UnlockReason from "types/UnlockReason"
import {
  AuditLogEvent,
  AuditLogEventOptions
} from "@moj-bichard7-developers/bichard7-next-core/dist/types/AuditLogEvent"
import storeAuditLogEvents from "./storeAuditLogEvents"
import getCourtCase from "./getCourtCase"
import getAuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/dist/lib/auditLog/getAuditLogEvent"
import EventCategory from "@moj-bichard7-developers/bichard7-next-core/dist/types/EventCategory"
import { AUDIT_LOG_EVENT_SOURCE } from "../config"

const reallocateCourtCaseToForce = async (
  dataSource: DataSource | EntityManager,
  courtCaseId: number,
  user: User,
  forceCode: string,
  note?: string
): Promise<UpdateResult | Error> => {
  // TODO:
  // - Generate TRPR0028 if necessary
  // - Reset triggers on reallocate
  return dataSource.transaction("SERIALIZABLE", async (entityManager): Promise<UpdateResult | Error> => {
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
      getAuditLogEvent(
        AuditLogEventOptions.hearingOutcomeReallocated,
        EventCategory.information,
        AUDIT_LOG_EVENT_SOURCE,
        {
          user: user.username,
          auditLogVersion: 2,
          "New Force Owner": `${newForceCode}00`
        }
      )
    )

    const unlockResult = await updateLockStatusToUnlocked(
      entityManager,
      courtCase,
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

    return queryResult
  })
}

export default reallocateCourtCaseToForce

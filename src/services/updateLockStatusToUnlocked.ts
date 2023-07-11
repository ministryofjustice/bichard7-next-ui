import { EntityManager, UpdateQueryBuilder, UpdateResult } from "typeorm/"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"
import courtCasesByOrganisationUnitQuery from "./queries/courtCasesByOrganisationUnitQuery"
import {
  AuditLogEvent,
  AuditLogEventOptions
} from "@moj-bichard7-developers/bichard7-next-core/dist/types/AuditLogEvent"
import getAuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/dist/lib/auditLog/getAuditLogEvent"
import { isError } from "types/Result"
import UnlockReason from "types/UnlockReason"
import getCourtCase from "./getCourtCase"
import EventCategory from "@moj-bichard7-developers/bichard7-next-core/dist/types/EventCategory"

const updateLockStatusToUnlocked = async (
  dataSource: EntityManager,
  courtCaseId: number,
  user: User,
  unlockReason: UnlockReason,
  events: AuditLogEvent[]
): Promise<UpdateResult | Error | undefined> => {
  const { username } = user
  const shouldUnlockExceptions =
    user.hasAccessToExceptions &&
    (unlockReason === UnlockReason.TriggerAndException || unlockReason === UnlockReason.Exception)
  const shouldUnlockTriggers =
    user.hasAccessToTriggers &&
    (unlockReason === UnlockReason.TriggerAndException || unlockReason === UnlockReason.Trigger)

  if (!shouldUnlockExceptions && !shouldUnlockTriggers) {
    return new Error("User hasn't got permission to unlock the case")
  }

  const courtCase = await getCourtCase(dataSource, courtCaseId)

  if (isError(courtCase)) {
    throw courtCase
  }

  if (!courtCase) {
    throw new Error("Failed to unlock: Case not found")
  }

  if (!courtCase.errorLockedByUsername && !courtCase.triggerLockedByUsername) {
    return
  }

  const generatedEvents: AuditLogEvent[] = []
  const courtCaseRepository = dataSource.getRepository(CourtCase)
  const setFields: QueryDeepPartialEntity<CourtCase> = {}
  let query = courtCaseRepository.createQueryBuilder().update(CourtCase)

  if (shouldUnlockExceptions && !!courtCase.errorLockedByUsername) {
    setFields.errorLockedByUsername = null
    generatedEvents.push(
      getAuditLogEvent(AuditLogEventOptions.exceptionUnlocked, EventCategory.information, "Bichard New UI", {
        user: username,
        auditLogVersion: 2
      })
    )
  }
  if (shouldUnlockTriggers && !!courtCase.triggerLockedByUsername) {
    setFields.triggerLockedByUsername = null
    generatedEvents.push(
      getAuditLogEvent(AuditLogEventOptions.triggerUnlocked, EventCategory.information, "Bichard New UI", {
        user: username,
        auditLogVersion: 2
      })
    )
  }

  query.set(setFields)
  query = courtCasesByOrganisationUnitQuery(query, user) as UpdateQueryBuilder<CourtCase>
  query.andWhere("error_id = :id", { id: courtCaseId })

  if (!user.isSupervisor && shouldUnlockExceptions && !!courtCase.errorLockedByUsername) {
    query.andWhere({ errorLockedByUsername: username })
  }

  if (!user.isSupervisor && shouldUnlockTriggers && !!courtCase.triggerLockedByUsername) {
    query.andWhere({ triggerLockedByUsername: username })
  }

  const result = await query.execute().catch((error: Error) => error)

  if (!isError(result) && result.affected && result.affected > 0) {
    generatedEvents.forEach((event) => events.push(event))
  }

  return result
}

export default updateLockStatusToUnlocked

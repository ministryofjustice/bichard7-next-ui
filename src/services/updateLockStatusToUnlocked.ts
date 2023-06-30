import { EntityManager, UpdateQueryBuilder, UpdateResult } from "typeorm/"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"
import courtCasesByOrganisationUnitQuery from "./queries/courtCasesByOrganisationUnitQuery"
import AuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AuditLogEvent"
import getAuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/lib/auditLog/getAuditLogEvent"
import { isError } from "types/Result"
import UnlockReason from "types/UnlockReason"
import { canLockExceptions, canLockTriggers, isSupervisor } from "utils/userPermissions"

const updateLockStatusToUnlocked = async (
  dataSource: EntityManager,
  courtCaseId: number,
  user: User,
  unlockReason: UnlockReason,
  events: AuditLogEvent[]
): Promise<UpdateResult | Error> => {
  const { username } = user
  const shouldUnlockExceptions =
    canLockExceptions(user) &&
    (unlockReason === UnlockReason.TriggerAndException || unlockReason === UnlockReason.Exception)
  const shouldUnlockTriggers =
    canLockTriggers(user) &&
    (unlockReason === UnlockReason.TriggerAndException || unlockReason === UnlockReason.Trigger)

  if (!shouldUnlockExceptions && !shouldUnlockTriggers) {
    return new Error("User hasn't got permission to unlock the case")
  }

  const generatedEvents: AuditLogEvent[] = []
  const courtCaseRepository = dataSource.getRepository(CourtCase)
  const setFields: QueryDeepPartialEntity<CourtCase> = {}
  let query = courtCaseRepository.createQueryBuilder().update(CourtCase)

  if (shouldUnlockExceptions) {
    setFields.errorLockedByUsername = null
    generatedEvents.push(
      getAuditLogEvent("information", "Exception unlocked", "Bichard New UI", {
        user: username,
        auditLogVersion: 2,
        eventCode: "exceptions.unlocked"
      })
    )
  }
  if (shouldUnlockTriggers) {
    setFields.triggerLockedByUsername = null
    generatedEvents.push(
      getAuditLogEvent("information", "Trigger unlocked", "Bichard New UI", {
        user: username,
        auditLogVersion: 2,
        eventCode: "triggers.unlocked"
      })
    )
  }

  query.set(setFields)
  query = courtCasesByOrganisationUnitQuery(query, user) as UpdateQueryBuilder<CourtCase>
  query.andWhere("error_id = :id", { id: courtCaseId })

  if (!isSupervisor(user) && shouldUnlockExceptions) {
    query.andWhere({ errorLockedByUsername: username })
  }

  if (!isSupervisor(user) && shouldUnlockTriggers) {
    query.andWhere({ triggerLockedByUsername: username })
  }

  const result = await query.execute().catch((error: Error) => error)

  if (!isError(result) && result.affected && result.affected > 0) {
    generatedEvents.forEach((event) => events.push(event))
  }

  return result
}

export default updateLockStatusToUnlocked

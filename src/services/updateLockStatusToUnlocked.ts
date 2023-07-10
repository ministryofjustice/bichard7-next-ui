import { EntityManager, Repository, UpdateQueryBuilder, UpdateResult } from "typeorm/"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"
import courtCasesByOrganisationUnitQuery from "./queries/courtCasesByOrganisationUnitQuery"
import AuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AuditLogEvent"
import getAuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/lib/auditLog/getAuditLogEvent"
import { isError } from "types/Result"
import UnlockReason from "types/UnlockReason"
import getCourtCase from "./getCourtCase"
import { AUDIT_LOG_EVENT_SOURCE } from "../config"

const updatedFieldName = {
  Exception: "errorLockedByUsername",
  Trigger: "triggerLockedByUsername"
}

const unlockOperation = async (
  unlockReason: "Trigger" | "Exception",
  courtCaseRepository: Repository<CourtCase>,
  courtCaseId: number,
  user: User,
  events: AuditLogEvent[]
): Promise<UpdateResult | Error> => {
  const query = courtCasesByOrganisationUnitQuery(
    courtCaseRepository.createQueryBuilder().update(CourtCase),
    user
  ) as UpdateQueryBuilder<CourtCase>
  query.set({ [updatedFieldName[unlockReason]]: null })
  query.andWhere("error_id = :id", { id: courtCaseId }) // .andWhere is required because .where overwrites courtCasesByOrganisationUnitQuery conditions

  if (!user.isSupervisor) {
    query.andWhere({ [updatedFieldName[unlockReason]]: user.username })
  }

  const result = await query.execute().catch((error: Error) => error)

  if (isError(result)) {
    return result
  }

  if (result.affected && result.affected > 0) {
    events.push(
      getAuditLogEvent("information", `${unlockReason} unlocked`, AUDIT_LOG_EVENT_SOURCE, {
        user: user.username,
        auditLogVersion: 2,
        eventCode: `${unlockReason.toLowerCase()}s.unlocked`
      })
    )
  }
  return result
}

const updateLockStatusToUnlocked = async (
  dataSource: EntityManager,
  courtCaseId: number,
  user: User,
  unlockReason: UnlockReason,
  events: AuditLogEvent[]
): Promise<UpdateResult | Error> => {
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

  const anyLockUserHasPermissionToUnlock =
    (user.hasAccessToExceptions && courtCase.errorLockedByUsername) ||
    (user.hasAccessToTriggers && courtCase.triggerLockedByUsername)

  if (!anyLockUserHasPermissionToUnlock) {
    return new Error("Case is not locked")
  }

  let result: UpdateResult | Error | undefined
  const courtCaseRepository = dataSource.getRepository(CourtCase)

  if (shouldUnlockExceptions && !!courtCase.errorLockedByUsername) {
    result = await unlockOperation("Exception", courtCaseRepository, courtCaseId, user, events)
  }

  if (shouldUnlockTriggers && !!courtCase.triggerLockedByUsername) {
    result = await unlockOperation("Trigger", courtCaseRepository, courtCaseId, user, events)
  }

  return result ?? new Error("Failed to unlock case")
}

export default updateLockStatusToUnlocked

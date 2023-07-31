import { EntityManager, Repository, UpdateQueryBuilder, UpdateResult } from "typeorm/"
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
import { AUDIT_LOG_EVENT_SOURCE } from "../config"
import EventCategory from "@moj-bichard7-developers/bichard7-next-core/dist/types/EventCategory"
import Feature from "types/Feature"

const unlock = async (
  unlockReason: "Trigger" | "Exception",
  courtCaseRepository: Repository<CourtCase>,
  courtCaseId: number,
  user: User,
  events: AuditLogEvent[]
): Promise<UpdateResult | Error> => {
  const updatedFieldName = {
    Exception: "errorLockedByUsername",
    Trigger: "triggerLockedByUsername"
  }[unlockReason]

  const query = courtCasesByOrganisationUnitQuery(
    courtCaseRepository.createQueryBuilder().update(CourtCase),
    user
  ) as UpdateQueryBuilder<CourtCase>
  query.set({ [updatedFieldName]: null })
  query.andWhere("error_id = :id", { id: courtCaseId }) // .andWhere is required because .where overwrites courtCasesByOrganisationUnitQuery conditions

  if (!user.isSupervisor) {
    query.andWhere({ [updatedFieldName]: user.username })
  }

  const result = await query.execute().catch((error: Error) => error)

  if (isError(result)) {
    return result
  }

  if (result.affected && result.affected > 0) {
    events.push(
      getAuditLogEvent(
        unlockReason === "Exception" ? AuditLogEventOptions.exceptionUnlocked : AuditLogEventOptions.triggerUnlocked,
        EventCategory.information,
        AUDIT_LOG_EVENT_SOURCE,
        {
          user: user.username,
          auditLogVersion: 2
        }
      )
    )
  }
  return result
}

const updateLockStatusToUnlocked = async (
  dataSource: EntityManager,
  courtCase: CourtCase,
  user: User,
  unlockReason: UnlockReason,
  events: AuditLogEvent[]
): Promise<UpdateResult | Error> => {
  const shouldUnlockExceptions =
    user.hasAccessTo[Feature.Exceptions] &&
    (unlockReason === UnlockReason.TriggerAndException || unlockReason === UnlockReason.Exception)
  const shouldUnlockTriggers =
    user.hasAccessTo[Feature.Triggers] &&
    (unlockReason === UnlockReason.TriggerAndException || unlockReason === UnlockReason.Trigger)

  if (!shouldUnlockExceptions && !shouldUnlockTriggers) {
    return new Error("User hasn't got permission to unlock the case")
  }

  if (!courtCase) {
    throw new Error("Failed to unlock: Case not found")
  }

  const anyLockUserHasPermissionToUnlock =
    (user.hasAccessTo[Feature.Exceptions] && courtCase.errorLockedByUsername) ||
    (user.hasAccessTo[Feature.Triggers] && courtCase.triggerLockedByUsername)

  if (!anyLockUserHasPermissionToUnlock) {
    return new Error("Case is not locked")
  }

  let result: UpdateResult | Error | undefined
  const courtCaseRepository = dataSource.getRepository(CourtCase)

  if (shouldUnlockExceptions && !!courtCase.errorLockedByUsername) {
    result = await unlock("Exception", courtCaseRepository, courtCase.errorId, user, events)
  }

  if (shouldUnlockTriggers && !!courtCase.triggerLockedByUsername) {
    result = await unlock("Trigger", courtCaseRepository, courtCase.errorId, user, events)
  }

  return result ?? new Error("Failed to unlock case")
}

export default updateLockStatusToUnlocked

import { EntityManager, UpdateQueryBuilder, UpdateResult } from "typeorm/"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"
import courtCasesByOrganisationUnitQuery from "./queries/courtCasesByOrganisationUnitQuery"
import AuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AuditLogEvent"
import getAuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/lib/auditLog/getAuditLogEvent"

const updateLockStatusToUnlocked = async (
  dataSource: EntityManager,
  courtCaseId: number,
  user: User,
  unlockReason?: "Trigger" | "Exception",
  events?: AuditLogEvent[]
): Promise<UpdateResult | Error> => {
  const { canLockExceptions, canLockTriggers, isSupervisor, username } = user
  const shouldUnlockExceptions = canLockExceptions && (unlockReason === undefined || unlockReason === "Exception")
  const shouldUnlockTriggers = canLockTriggers && (unlockReason === undefined || unlockReason === "Trigger")
  if (!shouldUnlockExceptions && !shouldUnlockTriggers) {
    return new Error("User hasn't got permission to unlock the case")
  }

  const courtCaseRepository = dataSource.getRepository(CourtCase)
  const setFields: QueryDeepPartialEntity<CourtCase> = {}
  let query = courtCaseRepository.createQueryBuilder().update(CourtCase)

  if (shouldUnlockExceptions) {
    setFields.errorLockedByUsername = null
  }
  if (shouldUnlockTriggers) {
    setFields.triggerLockedByUsername = null
  }

  query.set(setFields)
  query = courtCasesByOrganisationUnitQuery(query, user) as UpdateQueryBuilder<CourtCase>
  query.andWhere("error_id = :id", { id: courtCaseId })

  if (!isSupervisor && shouldUnlockExceptions) {
    query.andWhere({ errorLockedByUsername: username })
  }

  if (!isSupervisor && shouldUnlockTriggers) {
    query.andWhere({ triggerLockedByUsername: username })
  }

  const result = query.execute()?.catch((error: Error) => error)
  events?.push(
    getAuditLogEvent("information", "Exception unlocked", "Bichard New UI", {
      user: username,
      auditLogVersion: 2,
      eventCode: "exceptions.unlocked"
    })
  )

  return result
}

export default updateLockStatusToUnlocked

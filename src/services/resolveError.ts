import { EntityManager, MoreThan, Not, UpdateQueryBuilder, UpdateResult } from "typeorm"
import CourtCase from "./entities/CourtCase"
import User from "./entities/User"
import courtCasesByOrganisationUnitQuery from "./queries/courtCasesByOrganisationUnitQuery"
import AuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AuditLogEvent"
import getAuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/lib/auditLog/getAuditLogEvent"
import Trigger from "./entities/Trigger"
import { validateManualResolution } from "utils/validators/validateManualResolution"
import { ManualResolution, ResolutionReasonCode } from "types/ManualResolution"
import { isError } from "types/Result"
import { AUDIT_LOG_EVENT_SOURCE } from "../config"

const resolveError = async (
  entityManager: EntityManager,
  courtCase: CourtCase,
  user: User,
  resolution: ManualResolution,
  events?: AuditLogEvent[]
): Promise<UpdateResult | Error> => {
  const resolutionError = validateManualResolution(resolution).error

  if (resolutionError) {
    throw new Error(resolutionError)
  }

  const courtCaseRepository = entityManager.getRepository(CourtCase)
  const resolver = user.username
  const resolutionTimestamp = new Date()
  let query = courtCaseRepository.createQueryBuilder().update(CourtCase)
  query = courtCasesByOrganisationUnitQuery(query, user) as UpdateQueryBuilder<CourtCase>

  const queryParams: Record<string, unknown> = {
    errorStatus: "Resolved",
    errorResolvedBy: resolver,
    errorResolvedTimestamp: resolutionTimestamp
  }

  const triggersResolved =
    (
      await entityManager.getRepository(Trigger).find({
        where: {
          errorId: courtCase.errorId,
          status: Not("Resolved")
        }
      })
    ).length === 0

  if (triggersResolved) {
    queryParams.resolutionTimestamp = resolutionTimestamp
  }

  query.set(queryParams)
  query.andWhere({
    errorId: courtCase.errorId,
    errorLockedByUsername: resolver,
    errorCount: MoreThan(0),
    errorStatus: "Unresolved"
  })

  const queryResult = await query.execute()?.catch((error: Error) => error)

  if (isError(queryResult)) {
    return queryResult
  }

  if (queryResult.affected === 0) {
    return new Error("Failed to resolve case")
  }

  events?.push(
    getAuditLogEvent("information", "Exception marked as resolved by user", AUDIT_LOG_EVENT_SOURCE, {
      user: user.username,
      auditLogVersion: 2,
      eventCode: "exceptions.resolved",
      resolutionReasonCode: ResolutionReasonCode[resolution.reason],
      resolutionReasonText: resolution.reasonText
    })
  )

  return queryResult
}

export default resolveError

import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import courtCasesByOrganisationUnitQuery from "services/queries/courtCasesByOrganisationUnitQuery"
import leftJoinAndSelectTriggersQuery from "services/queries/leftJoinAndSelectTriggersQuery"
import { DataSource, LessThanOrEqual, MoreThanOrEqual } from "typeorm"
import { ReportQueryParams } from "types/CaseListQueryParams"
import { ListCourtCaseResult } from "types/ListCourtCasesResult"
import Permission from "types/Permission"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"

const getExceptionDetailReport = async (
  connection: DataSource,
  { from, to }: ReportQueryParams,
  user: User
): PromiseResult<ListCourtCaseResult> => {
  if (!user.hasAccessTo[Permission.ViewReports]) {
    return {
      result: [],
      totalCases: 0
    }
  }

  const repository = connection.getRepository(CourtCase)

  // TODO: We may reduce data once we have answers from UCP
  let query = repository
    .createQueryBuilder("courtCase")
    .select([
      "courtCase.errorId",
      "courtCase.triggerCount",
      "courtCase.isUrgent",
      "courtCase.asn",
      "courtCase.errorReport",
      "courtCase.errorReason",
      "courtCase.triggerReason",
      "courtCase.errorCount",
      "courtCase.errorStatus",
      "courtCase.triggerStatus",
      "courtCase.courtDate",
      "courtCase.ptiurn",
      "courtCase.courtName",
      "courtCase.resolutionTimestamp",
      "courtCase.errorResolvedBy",
      "courtCase.triggerResolvedBy",
      "courtCase.defendantName",
      "courtCase.errorLockedByUsername",
      "courtCase.triggerLockedByUsername"
    ])
  query = courtCasesByOrganisationUnitQuery(query, user)
  leftJoinAndSelectTriggersQuery(query, user.excludedTriggers, "Resolved")
    .leftJoinAndSelect("courtCase.notes", "note")
    .leftJoin("courtCase.errorLockedByUser", "errorLockedByUser")
    .addSelect(["errorLockedByUser.forenames", "errorLockedByUser.surname"])
    .leftJoin("courtCase.triggerLockedByUser", "triggerLockedByUser")
    .addSelect(["triggerLockedByUser.forenames", "triggerLockedByUser.surname"])

  // Filters
  query
    .andWhere({ errorResolvedTimestamp: MoreThanOrEqual(from) })
    .andWhere({ errorResolvedTimestamp: LessThanOrEqual(to) })

  const result = await query.getManyAndCount().catch((error: Error) => error)
  return isError(result)
    ? result
    : {
        result: result[0],
        totalCases: result[1]
      }
}

export default getExceptionDetailReport

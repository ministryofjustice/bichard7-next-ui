import { ResolutionStatus } from "types/ResolutionStatus"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"

export default async (
  caseId: number,
  exceptionCode: string,
  errorReport?: string,
  exceptionResolved?: ResolutionStatus
): Promise<boolean> => {
  const dataSource = await getDataSource()

  await dataSource
    .createQueryBuilder()
    .update(CourtCase)
    .set({
      errorCount: () => "error_count + 1",
      errorReason: exceptionCode,
      ...(errorReport && {
        errorReport: () =>
          `(CASE WHEN (error_report = '') THEN '${errorReport}' ELSE error_report || ', ' || '${errorReport}' END)`
      }),
      errorResolvedBy: exceptionResolved === "Resolved" ? "Dummy UserName" : null,
      errorResolvedTimestamp: exceptionResolved === "Resolved" ? new Date() : null,
      errorStatus: exceptionResolved ?? "Unresolved"
    })
    .where("errorId = :id", { id: caseId })
    .execute()

  return true
}

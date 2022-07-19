import CourtCase from "../../../src/entities/CourtCase"
import getDataSource from "../../../src/lib/getDataSource"

export default async (caseId: number, exceptionCode: string): Promise<boolean> => {
  const dataSource = await getDataSource()

  await dataSource
    .createQueryBuilder()
    .update(CourtCase)
    .set({
      errorCount: () => "error_count + 1",
      errorReason: exceptionCode
    })
    .where("errorId = :id", { id: caseId })
    .execute()

  await dataSource.destroy()

  return true
}

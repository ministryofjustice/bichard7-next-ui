import { DataSource } from "typeorm"
import CourtCase from "./entities/CourtCase"

const tryToLockCourtCase = async (dataSource: DataSource, courtCaseId: number, userName: string): Promise<boolean> => {
  const courtCaseRepository = await dataSource.getRepository(CourtCase)

  try {
    await courtCaseRepository
      .createQueryBuilder()
      .update(CourtCase)
      .set({
        errorLockedById: userName,
        triggerLockedById: userName
      })
      .where("error_id = :id", { id: courtCaseId })
      .andWhere("error_locked_by_id IS NULL")
      .andWhere("trigger_locked_by_id IS NULL")
      .execute()
  } catch (err) {
    console.error(err)
    return false
  }
  return true
}

// const lockCourtCase = async (
//   dataSource: DataSource | EntityManager,
//   courtCase: CourtCase,
//   userName: string
// ): PromiseResult<CourtCase> => {
//   const courtCaseRepository = await dataSource.getRepository(CourtCase)

//   if (!courtCase?.triggerLockedById) {
//     courtCase.triggerLockedById = userName
//   }

//   if (!courtCase?.errorLockedById) {
//     courtCase.errorLockedById = userName
//   }

//   const query = courtCaseRepository.save(courtCase)
// }

export default tryToLockCourtCase

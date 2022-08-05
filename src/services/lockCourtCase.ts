import { DataSource, IsNull } from "typeorm"
import PromiseResult from "../types/PromiseResult"
import CourtCase from "./entities/CourtCase"

const lockCourtCase = async (
  dataSource: DataSource,
  errorId: number,
  userName: string
): Promise<PromiseResult<Error | void>> => {
  const queryRunner = dataSource.createQueryRunner()
  await queryRunner.startTransaction()

  let result

  try {
    const courtCaseRepository = dataSource.getRepository(CourtCase)
    courtCaseRepository
      .createQueryBuilder("courtCase")
      .update(CourtCase)
      .set({ triggerLockedById: userName })
      .where("errorId = :errorId", { errorId: errorId })
      .andWhere({
        triggerLockedById: IsNull()
      })
      .execute()

    courtCaseRepository
      .createQueryBuilder("courtCase")
      .update(CourtCase)
      .set({ errorLockedById: userName })
      .where("errorId = :errorId", { errorId: errorId })
      .andWhere({
        errorLockedById: IsNull()
      })
      .execute()

    await queryRunner.commitTransaction()
  } catch (err) {
    result = err
    await queryRunner.rollbackTransaction()
  } finally {
    result = await queryRunner.release()
  }

  return result
}

export default lockCourtCase

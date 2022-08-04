import { DataSource } from "typeorm"
import PromiseResult from "../types/PromiseResult"
import CourtCase from "./entities/CourtCase"

const lockCourtCase = async (
  dataSource: DataSource,
  errorId: number,
  userName: string
): Promise<PromiseResult<boolean>> => {
  const courtCaseRepository = dataSource.getRepository(CourtCase)
  const existingCourtCase = await courtCaseRepository.findOneBy({
    errorId: errorId
  })

  const query = courtCaseRepository.createQueryBuilder("courtCase").update(CourtCase)

  if (!existingCourtCase?.triggerLockedById && !existingCourtCase?.errorLockedById) {
    query.set({ errorLockedById: userName, triggerLockedById: userName })
  } else if (!existingCourtCase?.errorLockedById) {
    query.set({ errorLockedById: userName })
  } else if (!existingCourtCase?.triggerLockedById) {
    query.set({ triggerLockedById: userName })
  }

  if (!existingCourtCase?.triggerLockedById || !existingCourtCase?.errorLockedById) {
    return query
      .where("errorId = :errorId", { errorId: errorId })
      .execute()
      .catch((error) => error)
  }

  return false
}

export default lockCourtCase

import { DataSource } from "typeorm"
import PromiseResult from "../types/PromiseResult"
import CourtCase from "./entities/CourtCase"

const lockCourtCase = async (
  dataSource: DataSource,
  courtCase: CourtCase,
  userName: string
): Promise<PromiseResult<boolean>> => {
  const courtCaseRepository = await dataSource.getRepository(CourtCase)

  const query = courtCaseRepository.createQueryBuilder("courtCase").update(CourtCase)
  if (!courtCase?.triggerLockedById && !courtCase?.errorLockedById) {
    query.set({ errorLockedById: userName, triggerLockedById: userName })
  } else if (!courtCase?.errorLockedById) {
    query.set({ errorLockedById: userName })
  } else if (!courtCase?.triggerLockedById) {
    query.set({ triggerLockedById: userName })
  }

  if (!courtCase?.triggerLockedById || !courtCase?.errorLockedById) {
    return query
      .where("errorId = :errorId", { errorId: courtCase.errorId })
      .execute()
      .catch((error) => error)
  }

  return Promise.resolve(false)
}

export default lockCourtCase

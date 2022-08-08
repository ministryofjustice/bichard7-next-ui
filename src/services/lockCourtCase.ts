import { DataSource, EntityManager } from "typeorm"
import PromiseResult from "../types/PromiseResult"
import CourtCase from "./entities/CourtCase"

const lockCourtCase = async (
  dataSource: DataSource | EntityManager,
  courtCase: CourtCase,
  userName: string
): PromiseResult<CourtCase> => {
  const courtCaseRepository = await dataSource.getRepository(CourtCase)

  if (!courtCase?.triggerLockedById) {
    courtCase.triggerLockedById = userName
  }

  if (!courtCase?.errorLockedById) {
    courtCase.errorLockedById = userName
  }

  return courtCaseRepository.save(courtCase)
}

export default lockCourtCase

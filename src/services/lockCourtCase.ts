import { DataSource } from "typeorm"
import PromiseResult from "../types/PromiseResult"
import CourtCase from "./entities/CourtCase"

const lockCourtCase = async (
  dataSource: DataSource,
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

  if (!courtCase?.triggerLockedById || !courtCase?.errorLockedById) {
    return courtCaseRepository.save(courtCase)
  }

  return Promise.resolve(courtCase)
}

export default lockCourtCase

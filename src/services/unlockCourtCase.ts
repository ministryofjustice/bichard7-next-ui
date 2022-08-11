import { DataSource } from "typeorm/"
import CourtCase from "./entities/CourtCase"

const unlockCourtCase = async (dataSource: DataSource, courtCase: CourtCase): Promise<boolean | Error> => {
  const courtCaseRepository = await dataSource.getRepository(CourtCase)

  courtCase.errorLockedById = null
  courtCase.triggerLockedById = null

  try {
    await courtCaseRepository.update(courtCase.errorId, courtCase)
  } catch (error) {
    return error as Error
  }

  return true
}

export default unlockCourtCase

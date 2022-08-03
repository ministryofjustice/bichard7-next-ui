import { DataSource } from "typeorm"
import PromiseResult from "../types/PromiseResult"
import CourtCase from "./entities/CourtCase"
import { isError } from "../types/Result"

const lockCourtCase = async (
  dataSource: DataSource,
  errorId: number,
  userName: string
): Promise<PromiseResult<CourtCase | null>> => {
  const courtCaseRepository = dataSource.getRepository(CourtCase)
  const courtCase = await courtCaseRepository.findOneBy({
    errorId: errorId
  })

  if (!isError(courtCase) && courtCase) {
    courtCase.triggerLockedById = courtCase.triggerLockedById ? courtCase.triggerLockedById : userName
    courtCase.errorLockedById = courtCase.errorLockedById ? courtCase.errorLockedById : userName

    return courtCaseRepository.save(courtCase)
  } else {
    return courtCase
  }
}

export default lockCourtCase

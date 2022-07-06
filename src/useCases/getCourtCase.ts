import CourtCase from "../entities/CourtCase"
import { DataSource } from "typeorm"
import PromiseResult from "../types/PromiseResult"
import { Result } from "../types/Result"

const getCourtCase = async (
  dataSource: DataSource,
  courtCaseId: number,
  forces: string[]
): PromiseResult<CourtCase | null> => {
  const courtCaseRepository = dataSource.getRepository(CourtCase)
  const courtCase = (await courtCaseRepository
    .findOneBy({ errorId: courtCaseId })
    .catch((error) => error)) as Result<CourtCase | null>

  console.log(forces)
  return courtCase
}

export default getCourtCase

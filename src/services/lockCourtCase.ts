import { DataSource } from "typeorm"
import PromiseResult from "../types/PromiseResult"
import CourtCase from "./entities/CourtCase"

const lockCourtCase = (
  dataSource: DataSource,
  courtCaseId: number,
  forces: string
): PromiseResult<CourtCase | null> => {
  console.log(dataSource, courtCaseId, forces)
  return Promise.resolve(null)
}

export default lockCourtCase

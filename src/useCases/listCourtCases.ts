import CourtCase from "../entities/CourtCase"
import { DataSource, In } from "typeorm"
import PromiseResult from "../types/PromiseResult"
import KeyValuePair from "../types/KeyValuePair"
import getColumnName from "../lib/getColumnName"

const listCourtCases = async (connection: DataSource, forces: string[], limit: number): PromiseResult<CourtCase[]> => {
  const courtCaseRepository = connection.getRepository(CourtCase)
  const query = courtCaseRepository
    .createQueryBuilder("courtCase")
    .orderBy(getColumnName(courtCaseRepository, "errorId"), "ASC")
    .limit(limit)

  forces.forEach((f, i) => {
    const force = f.substring(1)
    const args: KeyValuePair<string, string> = {}
    args[`force${i}`] = force
    // use different named parameters for each force
    if (force.length === 1) {
      query.orWhere(`courtCase.orgForPoliceFilter like :force${i} || '__%'`, args)
    } else {
      query.orWhere(`courtCase.orgForPoliceFilter like :force${i} || '%'`, args)
    }

    if (force.length > 3) {
      const subCodes = Array.from([...force].keys())
        .splice(4)
        .map((index) => force.substring(0, index))
      query.orWhere({ orgForPoliceFilter: In(subCodes) })
    }
  })

  const result = await query.getMany().catch((error: Error) => error)
  return result
}

export default listCourtCases

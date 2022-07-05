import CourtCase from "../entities/CourtCase"
import { DataSource, In } from "typeorm"
import PromiseResult from "types/PromiseResult"

const listCourtCases = async (connection: DataSource, forces: string[], limit: number): PromiseResult<CourtCase[]> => {
  const CourtCaseRepository = connection.getRepository(CourtCase)
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  const errorIdColumnName = CourtCaseRepository.metadata.columns.find((c) => c.propertyName === "errorId")!.databaseName
  const query = CourtCaseRepository.createQueryBuilder("courtCase").orderBy(errorIdColumnName, "ASC").limit(limit)

  forces.forEach((f) => {
    const force = f.substring(1)
    if (force.length === 1) {
      query.orWhere("courtCase.orgForPoliceFilter like :force || '__%'", { force })
    } else {
      query.orWhere("courtCase.orgForPoliceFilter like :force || '%'", { force })
    }

    if (force.length > 3) {
      const subCodes = Array.from([...force].keys())
        .splice(4)
        .map((i) => force.substring(0, i))
      query.orWhere({ orgForPoliceFilter: In(subCodes) })
    }
  })

  const result = await query.getMany().catch((error: Error) => error)
  return result
}

export default listCourtCases

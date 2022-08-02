import CourtCase from "../entities/CourtCase"
import { Brackets, In, Repository, SelectQueryBuilder } from "typeorm"
import KeyValuePair from "../../types/KeyValuePair"

const courtCasesByVisibleForcesQuery = (
  repository: Repository<CourtCase>,
  forces: string[]
): SelectQueryBuilder<CourtCase> => {
  const query = repository.createQueryBuilder("courtCase")

  query.where(
    new Brackets((qb) => {
      if (forces.length < 1) {
        qb.where(":numForces > 0", { numForces: forces.length })
        return query
      }

      forces.forEach((force, i) => {
        const args: KeyValuePair<string, string> = {}
        args[`force${i}`] = force
        // use different named parameters for each force
        if (force.length === 1) {
          qb.orWhere(`courtCase.orgForPoliceFilter like :force${i} || '__%'`, args)
        } else {
          qb.orWhere(`courtCase.orgForPoliceFilter like :force${i} || '%'`, args)
        }

        if (force.length > 3) {
          const subCodes = Array.from([...force].keys())
            .splice(4)
            .map((index) => force.substring(0, index))
          qb.orWhere({ orgForPoliceFilter: In(subCodes) })
        }
      })
    })
  )

  return query
}

export default courtCasesByVisibleForcesQuery

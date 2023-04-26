import CourtCase from "../entities/CourtCase"
import { Brackets, In, Like, SelectQueryBuilder, UpdateQueryBuilder, WhereExpressionBuilder } from "typeorm"

const courtCasesByVisibleForcesQuery = (
  query: SelectQueryBuilder<CourtCase> | UpdateQueryBuilder<CourtCase> | WhereExpressionBuilder,
  forces: string[]
): SelectQueryBuilder<CourtCase> | UpdateQueryBuilder<CourtCase> | WhereExpressionBuilder => {
  query.orWhere(
    new Brackets((qb) => {
      if (forces.length < 1) {
        qb.where("FALSE") // prevent returning cases when there are no visible forces
        return query
      }

      forces.forEach((force) => {
        if (force.length === 1) {
          const condition = { orgForPoliceFilter: Like(`${force}__%`) }
          qb.where(condition)
        } else {
          const condition = { orgForPoliceFilter: Like(`${force}%`) }
          qb.orWhere(condition)
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

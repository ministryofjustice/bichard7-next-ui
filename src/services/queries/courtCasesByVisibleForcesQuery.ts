import { Brackets, SelectQueryBuilder, UpdateQueryBuilder, WhereExpressionBuilder } from "typeorm"
import CourtCase from "../entities/CourtCase"

const courtCasesByVisibleForcesQuery = (
  query: SelectQueryBuilder<CourtCase> | UpdateQueryBuilder<CourtCase> | WhereExpressionBuilder,
  forces: number[]
): SelectQueryBuilder<CourtCase> | UpdateQueryBuilder<CourtCase> | WhereExpressionBuilder => {
  query.orWhere(
    new Brackets((qb) => {
      if (forces.length < 1) {
        qb.where("FALSE") // prevent returning cases when there are no visible courts
        return
      }

      qb.where("br7own.force_code(org_for_police_filter) IN (:...forces)", { forces })
    })
  )

  return query
}

export default courtCasesByVisibleForcesQuery

import { Brackets, SelectQueryBuilder, UpdateQueryBuilder, WhereExpressionBuilder } from "typeorm"
import CourtCase from "../entities/CourtCase"

const courtCasesByVisibleForcesQuery = (
  query: SelectQueryBuilder<CourtCase> | UpdateQueryBuilder<CourtCase> | WhereExpressionBuilder,
  forces: number[]
): SelectQueryBuilder<CourtCase> | UpdateQueryBuilder<CourtCase> | WhereExpressionBuilder => {
  query.orWhere(
    new Brackets((qb) => {
      qb.where("br7own.force_code(org_for_police_filter) IN (:...forces)", { forces })
    })
  )

  return query
}

export default courtCasesByVisibleForcesQuery

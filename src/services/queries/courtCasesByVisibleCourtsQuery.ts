import { Brackets, Like, SelectQueryBuilder, UpdateQueryBuilder, WhereExpressionBuilder } from "typeorm"
import CourtCase from "../entities/CourtCase"

const courtCasesByVisibleCourtsQuery = (
  query: SelectQueryBuilder<CourtCase> | UpdateQueryBuilder<CourtCase> | WhereExpressionBuilder,
  courts: string[]
): SelectQueryBuilder<CourtCase> | UpdateQueryBuilder<CourtCase> | WhereExpressionBuilder => {
  query.orWhere(
    new Brackets((qb) => {
      if (courts.length < 1) {
        qb.where("FALSE") // prevent returning cases when there are no visible courts
        return
      }

      courts.forEach((code) => {
        const condition = { courtCode: Like(`${code}%`) }
        qb.orWhere(condition)
      })
    })
  )

  return query
}

export default courtCasesByVisibleCourtsQuery

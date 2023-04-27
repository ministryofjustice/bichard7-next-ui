import CourtCase from "../entities/CourtCase"
import { Brackets, SelectQueryBuilder, UpdateQueryBuilder } from "typeorm"
import User from "services/entities/User"
import courtCasesByVisibleForcesQuery from "./courtCasesByVisibleForcesQuery"
import courtCasesByVisibleCourtsQuery from "./courtCasesByVisibleCourtsQuery"

const courtCasesByOrganisationUnitQuery = (
  query: SelectQueryBuilder<CourtCase> | UpdateQueryBuilder<CourtCase>,
  user: User
): SelectQueryBuilder<CourtCase> | UpdateQueryBuilder<CourtCase> => {
  const { visibleForces, visibleCourts } = user
  query.where(
    new Brackets((qb) => {
      courtCasesByVisibleCourtsQuery(qb, visibleCourts)
      courtCasesByVisibleForcesQuery(qb, visibleForces)
    })
  )
  return query
}

export default courtCasesByOrganisationUnitQuery

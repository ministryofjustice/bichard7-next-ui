import User from "services/entities/User"
import { Brackets, SelectQueryBuilder, UpdateQueryBuilder } from "typeorm"
import CourtCase from "../entities/CourtCase"
import courtCasesByVisibleCourtsQuery from "./courtCasesByVisibleCourtsQuery"
import courtCasesByVisibleForcesQuery from "./courtCasesByVisibleForcesQuery"

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

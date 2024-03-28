import User from "services/entities/User"
import { Brackets } from "typeorm"
import { DatabaseQuery } from "types/DatabaseQuery"
import CourtCase from "../entities/CourtCase"
import courtCasesByVisibleCourtsQuery from "./courtCasesByVisibleCourtsQuery"
import courtCasesByVisibleForcesQuery from "./courtCasesByVisibleForcesQuery"

const courtCasesByOrganisationUnitQuery = <T extends DatabaseQuery<CourtCase>>(query: T, user: User): T => {
  const { visibleForces, visibleCourts } = user
  const inclusionList = visibleCourts.concat(visibleForces)
  query.where(
    new Brackets((qb) => {
      courtCasesByVisibleCourtsQuery(qb, inclusionList)
      courtCasesByVisibleForcesQuery(qb, inclusionList)
    })
  )

  return query
}

export default courtCasesByOrganisationUnitQuery

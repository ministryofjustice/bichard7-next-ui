import CourtCase from "../entities/CourtCase"
import { SelectQueryBuilder, UpdateQueryBuilder } from "typeorm"
import courtCasesByVisibleForcesQuery from "./courtCasesByVisibleForcesQuery"

const courtCasesByOrganisationUnitFilterQuery = (
  query: SelectQueryBuilder<CourtCase> | UpdateQueryBuilder<CourtCase>,
  forces: string[]
): SelectQueryBuilder<CourtCase> | UpdateQueryBuilder<CourtCase> => {
  return courtCasesByVisibleForcesQuery(query, forces)
}

export default courtCasesByOrganisationUnitFilterQuery

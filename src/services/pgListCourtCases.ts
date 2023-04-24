import { Client } from "pg"

export const pgListCourtCases = async (
  client: Client,
  filterOptions?: { defendantName?: string; courtName?: string }
) => {
  let queryString = "select * from br7own.error_list"

  const queryParameters = []
  const whereOrAnd = () => (queryParameters.length > 0 ? `and` : `where`)

  if (!!filterOptions?.defendantName) {
    queryString = queryString + ` ${whereOrAnd()} defendant_name ilike $${queryParameters.length + 1}`
    queryParameters.push("%" + filterOptions?.defendantName + "%")
  }

  if (!!filterOptions?.courtName) {
    queryString = queryString + ` ${whereOrAnd()} court_name ilike $${queryParameters.length + 1}`
    queryParameters.push("%" + filterOptions?.courtName + "%")
  }

  const queryResponse = await client.query(queryString, queryParameters)
  return queryResponse.rows
}

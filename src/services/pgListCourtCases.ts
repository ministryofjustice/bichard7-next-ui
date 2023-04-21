import { Client } from "pg"

export const pgListCourtCases = async (
  client: Client,
  filterOptions?: { defendantName?: string; courtName?: string }
) => {
  let queryString = "select * from br7own.error_list"
  console.log("defendant", filterOptions?.defendantName)
  console.log("court", filterOptions?.courtName)

  if (!!filterOptions?.defendantName) {
    queryString = queryString + ` where defendant_name ilike ${"'%" + filterOptions.defendantName + "%'"}`
  }

  if (!!filterOptions?.courtName) {
    queryString = queryString + ` where court_name ilike ${"'%" + filterOptions.courtName.replace("'", "''") + "%'"}`
  }

  const queryResponse = await client.query(queryString)
  return queryResponse.rows
}

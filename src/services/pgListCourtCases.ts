import { Client } from "pg"

export const pgListCourtCases = async (client: Client, filterOptions?: { defendantName?: string }) => {
  let queryString = "select * from br7own.error_list"

  if (!!filterOptions?.defendantName) {
    queryString = queryString + ` where defendant_name ilike ${"'" + filterOptions.defendantName + "'"}`
  }

  const queryResponse = await client.query(queryString)
  return queryResponse.rows
}

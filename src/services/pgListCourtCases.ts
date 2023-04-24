import { Client } from "pg"

export const pgListCourtCases = async (
  client: Client,
  filterOptions?: { defendantName?: string; courtName?: string }
) => {
  let queryString = "select * from br7own.error_list"
  // const text =
  // const values =

  const values = []

  if (!!filterOptions?.defendantName) {
    queryString = queryString + ` ${values.length > 0 ? `and` : `where`} defendant_name ilike $${values.length + 1}`
    values.push("%" + filterOptions?.defendantName + "%")
  }

  if (!!filterOptions?.courtName) {
    queryString = queryString + ` ${values.length > 0 ? `and` : `where`} court_name ilike $${values.length + 1}`
    values.push("%" + filterOptions?.courtName + "%")
  }

  const queryResponse = await client.query(queryString, values)
  return queryResponse.rows
}

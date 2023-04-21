import { Client } from "pg"

export const pgListCourtCases = async (
  client: Client
  // filterOptions?: { defendantName?: string; courtName?: string }
) => {
  const queryString = "select * from br7own.error_list"
  return client.query(queryString)
}
// console.log(courtCases)

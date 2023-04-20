import type { Sql } from "postgres"

export const postgresjsListCourtCases = async (database: Sql, filterOptions?: { defendantName: string }) => {
  const courtCases = database`SELECT * FROM br7own.error_list`
  console.log(courtCases)

  if (filterOptions?.defendantName) {
  }

  return courtCases
}

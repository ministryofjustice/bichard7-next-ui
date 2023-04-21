import type { Sql } from "postgres"

export const postgresjsListCourtCases = async (
  sql: Sql,
  filterOptions?: { defendantName?: string; courtName?: string }
) => {
  const query = "select * from br7own.error_list"
  sql.unsafe(query)

  const courtCases = sql`
  SELECT
   *
  FROM br7own.error_list 
   ${
     !!filterOptions?.defendantName
       ? sql`where defendant_name ilike ${"%" + filterOptions?.defendantName + "%"}`
       : sql``
   }
   ${!!filterOptions?.courtName ? sql`and court_name ilike ${"%" + filterOptions?.courtName + "%"}` : sql``}
`
  console.log(courtCases)

  return courtCases
}

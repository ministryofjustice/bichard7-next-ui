import type { Sql } from "postgres"

export const postgresjsListCourtCases = async (database: Sql, filterOptions?: { defendantName: string }) => {
  const courtCases = database`
  SELECT
   *
  FROM br7own.error_list 
   ${
     !!filterOptions?.defendantName
       ? database`where defendant_name ilike ${"%" + filterOptions?.defendantName + "%"}`
       : database``
   }
`
  console.log(courtCases)

  return courtCases
}

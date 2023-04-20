import type { Sql } from "postgres"

export const postgresjsListCourtCases = async (
  database: Sql,
  filterOptions?: { defendantName?: string; courtName?: string }
) => {
  const courtCases = database`
  SELECT
   *
  FROM br7own.error_list 
   ${
     !!filterOptions?.defendantName
       ? database`where defendant_name ilike ${"%" + filterOptions?.defendantName + "%"}`
       : database``
   }
   ${!!filterOptions?.courtName ? database`and court_name ilike ${"%" + filterOptions?.courtName + "%"}` : database``}
`
  console.log(courtCases)

  return courtCases
}

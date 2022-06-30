import Database from "types/Database"
import ErrorListItem from "types/ErrorListItem"
import PromiseResult from "types/PromiseResult"

const listCases = async (connection: Database, limit: number): PromiseResult<ErrorListItem[]> => {
  let cases

  const query = `
    SELECT
      *
    FROM br7own.error_list
    ORDER BY error_id
    LIMIT $\{limit\}
  `

  try {
    cases = await connection.manyOrNone(query, { limit })
  } catch (error) {
    return error as Error
  }

  return cases
}

export default listCases

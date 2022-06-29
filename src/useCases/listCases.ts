import Database from "types/Database"
import PromiseResult from "types/PromiseResult"

const listCases = async (connection: Database, limit: number): PromiseResult<any[]> => {
  let cases

  const query = `
    SELECT
      *
    FROM databasechangelog
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

import Database from "types/Database"
import ErrorListItem from "types/ErrorListItem"
import PromiseResult from "types/PromiseResult"

const listCases = async (connection: Database, forces: string[], limit: number): PromiseResult<ErrorListItem[]> => {
  let cases

  const conditions = forces.reduce((acc: string[], f) => {
    const trimmedForce = f.substring(1)
    if(trimmedForce.length === 1) {
      acc.push(`org_for_police_filter like '${trimmedForce}__%'`)
    } else {
      acc.push(`org_for_police_filter like '${trimmedForce}%'`)
    } 

    if(trimmedForce.length > 3) {
      const subCodes = new Array(trimmedForce.length)
        .map((_x, i) => i > 3 && trimmedForce.substring(0, i))
        .filter((x) => x)
        .map(x=>`'${x}'`)
        .join(",")

      acc.push((`org_for_police_filter IN (${subCodes})`))
    }

    return acc
  }, [] as string[])

  const query = `
  SELECT
    *
  FROM br7own.error_list
  WHERE ${conditions.join(" AND ")}
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

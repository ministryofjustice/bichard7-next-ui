import Database from "types/Database"
import ErrorListItem from "types/ErrorListItem"
import PromiseResult from "types/PromiseResult"

const listCases = (connection: Database, forces: string[], limit: number): PromiseResult<ErrorListItem[]> => {
  const conditions = forces.flatMap((f) => {
    const trimmedForce = f.substring(1)
    const forceConditions = []
    if (trimmedForce.length === 1) {
      forceConditions.push(`org_for_police_filter like '${trimmedForce}__%'`)
    } else {
      forceConditions.push(`org_for_police_filter like '${trimmedForce}%'`)
    }

    if (trimmedForce.length > 3) {
      const subCodes = [...new Array(trimmedForce.length + 1)]
        .map((_, i) => i > 3 && trimmedForce.substring(0, i))
        .filter((x) => x)
        .map((x) => `'${x}'`)
        .join(",")
      forceConditions.push(`org_for_police_filter IN (${subCodes})`)
    }

    return forceConditions
  })

  const query = `
  SELECT
    *
  FROM br7own.error_list
  WHERE ${conditions.join(" AND ")}
  ORDER BY error_id
  LIMIT $\{limit\}
`
  console.log(query)
  return connection.manyOrNone<ErrorListItem>(query, { limit }).catch((error) => error as Error)
}

export default listCases

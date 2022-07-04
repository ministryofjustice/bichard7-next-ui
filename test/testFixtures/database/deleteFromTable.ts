import getTestConnection from "../getTestConnection"
import { getTableName } from "./helpers"

const deleteFromTable = async (tableName: string, whereColumn?: string, whereValue?: string) => {
  const connection = getTestConnection()
  const isWhereClause = whereColumn && whereValue

  const deleteQuery = `DELETE FROM br7own.error_list; DELETE FROM $\{table\} ${
    isWhereClause ? `WHERE ${whereColumn} = $\{value\}` : ""
  }`

  const table = getTableName(tableName)
  const whereClause = isWhereClause ? { column: whereColumn, value: whereValue } : {}

  return connection.none(deleteQuery, { table, ...whereClause })
}

export default deleteFromTable

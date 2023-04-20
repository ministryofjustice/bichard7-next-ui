import postgres from "postgres"
import createDbConfig from "../utils/createDbConfig"

const dbConfig = createDbConfig()
const sql = postgres({
  ...dbConfig
})

const errorListRecords = async () => {
  const result = await sql`SELECT * FROM br7own.error_list`
  console.log(result)
  return result
}
errorListRecords()

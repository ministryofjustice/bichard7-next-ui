import pgPromise from "pg-promise"
import Database from "types/Database"
import DatabaseConfig from "./DatabaseConfig"

/* eslint-disable @typescript-eslint/no-explicit-any */

const createSingletonConnection = (name: string, config: DatabaseConfig, attachEvents: boolean): Database => {
  const connectionName = Symbol.for(name)
  let scope = (global as any)[connectionName]

  if (!scope) {
    scope = pgPromise(
      attachEvents
        ? {
            query(e) {
              console.log(`QUERY: ${e.query} PARAMS: ${e.params}`)
            },
            error(err, e) {
              console.log(err)

              if (e.cn) {
                console.log(`CONNECTION ERROR. QUERY: ${e.query}. PARAMS: ${e.params}`)
              }

              if (e.query) {
                console.log(`QUERY ERROR: QUERY: ${e.query} PARAMS: ${e.params}`)
              }

              if (e.ctx) {
                console.log(`CONTEXT: ${e.ctx}`)
              }
            }
          }
        : {}
    )({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      ssl: config.ssl ? { rejectUnauthorized: false } : false
    })
    ;(global as any)[connectionName as any] = scope
  }

  return scope
}

export default createSingletonConnection

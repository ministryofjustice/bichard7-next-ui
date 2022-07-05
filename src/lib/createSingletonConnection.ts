import CourtCase from "../entities/CourtCase"
import { DataSource } from "typeorm"
import DatabaseConfig from "./DatabaseConfig"

/* eslint-disable @typescript-eslint/no-explicit-any */

const createSingletonConnection = async (name: string, config: DatabaseConfig): Promise<DataSource> => {
  const connectionName = Symbol.for(name)
  let appDataSource = (global as any)[connectionName]

  if (!appDataSource) {
    appDataSource = new DataSource({
      type: "postgres",
      host: config.host,
      port: config.port,
      username: config.user,
      password: config.password,
      database: config.database,
      synchronize: false,
      logging: false,
      entities: [CourtCase],
      subscribers: [],
      migrations: [],
      schema: config.schema,
      ssl: config.ssl ? { rejectUnauthorized: false } : false
    })
    ;(global as any)[connectionName as any] = appDataSource

    await appDataSource.initialize()
  }

  return appDataSource
}

export default createSingletonConnection

import CourtCase from "../entities/CourtCase"
import { DataSource } from "typeorm"
import DatabaseConfig from "./DatabaseConfig"

const databaseConfig: DatabaseConfig = {
  host: process.env.DB_HOST ?? process.env.DB_AUTH_HOST ?? "localhost",
  user: process.env.DB_USER ?? process.env.DB_AUTH_USER ?? "bichard",
  password: process.env.DB_PASSWORD ?? process.env.DB_AUTH_PASSWORD ?? "password",
  database: process.env.DB_DATABASE ?? process.env.DB_AUTH_DATABASE ?? "bichard",
  port: parseInt(process.env.DB_PORT ?? process.env.DB_AUTH_PORT ?? "5432", 10),
  ssl: (process.env.DB_SSL ?? process.env.DB_AUTH_SSL) === "true",
  schema: "br7own"
}

const getDataSource = async (): Promise<DataSource> => {
  const appDataSource = new DataSource({
    type: "postgres",
    applicationName: "ui-connection",
    host: databaseConfig.host,
    port: databaseConfig.port,
    username: databaseConfig.user,
    password: databaseConfig.password,
    database: databaseConfig.database,
    synchronize: false,
    logging: false,
    entities: [CourtCase],
    subscribers: [],
    migrations: [],
    schema: databaseConfig.schema,
    ssl: databaseConfig.ssl ? { rejectUnauthorized: false } : false,
    extra: {
      max: 1
    }
  })

  if (!appDataSource.isInitialized) {
    await appDataSource.initialize()
  }

  return appDataSource
}

export default getDataSource

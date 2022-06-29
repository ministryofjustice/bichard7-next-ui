import Database from "types/Database"
import createSingletonConnection from "./createSingletonConnection"
import DatabaseConfig from "./DatabaseConfig"

const databaseConfig: DatabaseConfig = {
  host: process.env.DB_HOST ?? process.env.DB_AUTH_HOST ?? "localhost",
  user: process.env.DB_USER ?? process.env.DB_AUTH_USER ?? "bichard",
  password: process.env.DB_PASSWORD ?? process.env.DB_AUTH_PASSWORD ?? "password",
  database: process.env.DB_DATABASE ?? process.env.DB_AUTH_DATABASE ?? "bichard",
  port: parseInt(process.env.DB_PORT ?? process.env.DB_AUTH_PORT ?? "5432", 10),
  ssl: (process.env.DB_SSL ?? process.env.DB_AUTH_SSL) === "true"
}

const getConnection = (connectionName = "ui-connection", attachEvents = false): Database => {
  return createSingletonConnection(connectionName, databaseConfig, attachEvents)
}

export default getConnection

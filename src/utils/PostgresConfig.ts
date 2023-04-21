type PostgresConfig = {
  HOST: string
  PORT: number
  USERNAME: string
  PASSWORD: string
  DATABASE_NAME: string
  TABLE_NAME?: string
  SSL: boolean
}

export const createPgConfig: PostgresConfig = {
  HOST: "localhost",
  PORT: 5432,
  USERNAME: "bichard",
  PASSWORD: "password",
  DATABASE_NAME: "bichard",
  TABLE_NAME: "br7own.archive_error_list",
  SSL: false
}

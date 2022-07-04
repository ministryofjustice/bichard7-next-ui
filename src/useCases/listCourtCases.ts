import CourtCase from "../entities/CourtCase"
import { DataSource, In, Like } from "typeorm"
import Database from "types/Database"
import PromiseResult from "types/PromiseResult"

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "bichard",
  password: "password",
  database: "bichard",
  synchronize: false,
  logging: true,
  entities: [CourtCase],
  subscribers: [],
  migrations: [],
  schema: "br7own"
})

const listCourtCases = async (connection: Database, forces: string[], limit: number): PromiseResult<CourtCase[]> => {
  console.log(connection)
  await AppDataSource.initialize()
  const CourtCaseRepository = AppDataSource.getRepository(CourtCase)
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  const errorIdColumnName = CourtCaseRepository.metadata.columns.find((c) => c.propertyName === "errorId")!.databaseName
  const query = CourtCaseRepository.createQueryBuilder().orderBy(errorIdColumnName, "ASC").limit(limit)

  forces.forEach((f) => {
    const force = f.substring(1)
    // TODO ensure this isn't vulnerable to SQL injection e.g. using "%" for force,
    // perhaps by using named parameters?
    if (force.length === 1) {
      query.orWhere({ orgForPoliceFilter: Like(`${force}__%`) })
    } else {
      query.orWhere({ orgForPoliceFilter: Like(`${force}%`) })
    }

    if (force.length > 3) {
      const subCodes = Array.from([...force].keys())
        .splice(4)
        .map((i) => force.substring(0, i))
      query.orWhere({ orgForPoliceFilter: In(subCodes) })
    }
  })

  const result = await query.getMany().catch((error: Error) => error)
  await AppDataSource.destroy()
  return result
}

export default listCourtCases

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
  synchronize: true,
  logging: true,
  entities: [CourtCase],
  subscribers: [],
  migrations: []
})

const listCourtCases = async (connection: Database, forces: string[], limit: number): PromiseResult<CourtCase[]> => {
  console.log(connection)
  await AppDataSource.initialize()
  const CourtCaseRepository = AppDataSource.getRepository(CourtCase)
  const query = CourtCaseRepository.createQueryBuilder().orderBy({ errorId: "ASC" }).limit(limit)

  forces.forEach((f) => {
    const trimmedForce = f.substring(1)
    if (trimmedForce.length === 1) {
      query.orWhere({ orgForPoliceFilter: Like(":trimedForce__%") }, { trimmedForce })
    } else {
      query.orWhere({ orgForPoliceFilter: Like(":trimedForce%") }, { trimmedForce })
    }

    if (trimmedForce.length > 3) {
      const subCodes = [...new Array(trimmedForce.length + 1)]
        .map((_, i) => i > 3 && trimmedForce.substring(0, i))
        .filter((x) => x)
        .map((x) => `'${x}'`)
      query.orWhere({ orgForPoliceFilter: In(subCodes) })
    }
  })

  const result = await query.getMany().catch((error: Error) => error)
  await AppDataSource.destroy()
  return result
}

export default listCourtCases

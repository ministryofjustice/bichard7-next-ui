/* eslint-disable @typescript-eslint/naming-convention */
import "reflect-metadata"
import Note from "services/entities/Note"
import { pgListCourtCases } from "services/pgListCourtCases"
import { DataSource } from "typeorm"
import CourtCase from "../../src/services/entities/CourtCase"
import Trigger from "../../src/services/entities/Trigger"
import deleteFromEntity from "../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"
import { createPgConfig } from "utils/PostgresConfig"
import { Client } from "pg"
import getDataSource from "services/getDataSource"

jest.mock(
  "services/queries/courtCasesByVisibleForcesQuery",
  jest.fn(() =>
    jest.fn((query) => {
      return query
    })
  )
)
const dbConfig = createPgConfig

jest.setTimeout(100000)
describe("POSTGRESJS-listCourtCases", () => {
  let dataSource: DataSource
  let db: Client

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
    await deleteFromEntity(Trigger)
    await deleteFromEntity(Note)
    db = new Client({
      host: dbConfig.HOST,
      port: dbConfig.PORT,
      user: dbConfig.USERNAME,
      password: dbConfig.PASSWORD,
      database: dbConfig.DATABASE_NAME,
      ssl: dbConfig.SSL ? { rejectUnauthorized: false } : false
    })
    await db.connect()
  })
  afterEach(async () => {
    await db.end()
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  it("should return all cases when no there is no filter set ", async () => {
    const orgCode = "01FPA1"
    const defendantToInclude = "WAYNE Bruce"
    const defendantToIncludeWithPartialMatch = "WAYNE Bill"
    const defendantToNotInclude = "GORDON Barbara"

    await insertCourtCasesWithFields([
      { defendantName: defendantToInclude, orgForPoliceFilter: orgCode },
      { defendantName: defendantToNotInclude, orgForPoliceFilter: orgCode },
      { defendantName: defendantToIncludeWithPartialMatch, orgForPoliceFilter: orgCode }
    ])

    const result = await pgListCourtCases(db)
    expect(result.length).toBe(3)
  })

  describe("single filter tests", () => {
    it("should filter by defendant name, exact match", async () => {
      const defendantToInclude = "WAYNE Bruce"
      await insertCourtCasesWithFields([{ defendantName: defendantToInclude }])

      const courtCases = await pgListCourtCases(db, { defendantName: defendantToInclude })
      expect(courtCases.length).toBe(1)
    })

    // it("should list cases when there is partial and case insensitive match", async () => {
    //   const orgCode = "01FPA1"
    //   const defendantToInclude = "WAYNE Bruce"
    //   const defendantToIncludeWithPartialMatch = "WAYNE Bill"
    //   const defendantToNotInclude = "GORDON Barbara"
    //   insertCourtCasesWithFields([
    //     { defendantName: defendantToInclude, orgForPoliceFilter: orgCode },
    //     { defendantName: defendantToNotInclude, orgForPoliceFilter: orgCode },
    //     { defendantName: defendantToIncludeWithPartialMatch, orgForPoliceFilter: orgCode }
    //   ])
    //   let result = await pgListCourtCases(db, { defendantName: "wayne bruce" })
    //   expect(result).toHaveLength(1)
    //   expect(result[0].defendant_name).toStrictEqual(defendantToInclude)
    //   result = await pgListCourtCases(db, {
    //     defendantName: "wayne b"
    //   })
    //   expect(result).toHaveLength(2)
    //   expect(result[0].defendant_name).toStrictEqual(defendantToInclude)
    //   expect(result[1].defendant_name).toStrictEqual(defendantToIncludeWithPartialMatch)
    // })
  })

  // describe("search by court name", () => {
  //   it("should list cases when there is a case insensitive match", async () => {
  //     const orgCode = "01FPA1"
  //     const courtNameToInclude = "Magistrates' Courts London Croydon"
  //     const courtNameToIncludeWithPartialMatch = "Magistrates' Courts London Something Else"
  //     const courtNameToNotInclude = "Court Name not to include"

  //     await insertCourtCasesWithFields([
  //       { courtName: courtNameToInclude, orgForPoliceFilter: orgCode },
  //       { courtName: courtNameToIncludeWithPartialMatch, orgForPoliceFilter: orgCode },
  //       { courtName: courtNameToNotInclude, orgForPoliceFilter: orgCode }
  //     ])

  //     let result = await pgListCourtCases(db, {
  //       courtName: "Magistrates' Courts London Croydon"
  //     })
  //     expect(isError(result)).toBe(false)

  //     expect(result).toHaveLength(1)
  //     expect(result[0].court_name).toStrictEqual(courtNameToInclude)

  //     result = await pgListCourtCases(db, {
  //       courtName: "magistrates' courts london"
  //     })
  //     expect(isError(result)).toBe(false)

  //     expect(result).toHaveLength(2)
  //     expect(result[0].court_name).toStrictEqual(courtNameToInclude)
  //     expect(result[1].court_name).toStrictEqual(courtNameToIncludeWithPartialMatch)
  //   })
  // })
  // describe("Using a combination of filters", () => {
  //   it("Should filter Court name and defendant name", async () => {
  //     const orgCode = "01FPA1"
  //     const courtNameToInclude = "Magistrates' Courts London Croydon"
  //     const wrongCourtName = "The incorrect Court"
  //     const defendantToInclude = "WAYNE Bruce"
  //     const wrongDefendantName = "Ruce Bane"

  //     await insertCourtCasesWithFields([
  //       { courtName: courtNameToInclude, defendantName: wrongDefendantName, orgForPoliceFilter: orgCode },
  //       { courtName: wrongCourtName, defendantName: defendantToInclude, orgForPoliceFilter: orgCode },
  //       { courtName: courtNameToInclude, defendantName: defendantToInclude, orgForPoliceFilter: orgCode }
  //     ])

  //     const filteredCases = await pgListCourtCases(db, {
  //       defendantName: "WAYNE Bruce",
  //       courtName: "Magistrates' Courts London Croydon"
  //     })
  //     console.log(filteredCases)
  //     expect(isError(filteredCases)).toBe(false)

  //     expect(filteredCases).toHaveLength(1)
  //     expect(filteredCases[0].court_name).toStrictEqual(courtNameToInclude)
  //     expect(filteredCases[0].defendant_name).toStrictEqual(defendantToInclude)
  //   })
  // })
})

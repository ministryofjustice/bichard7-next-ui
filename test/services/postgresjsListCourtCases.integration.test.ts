/* eslint-disable @typescript-eslint/naming-convention */
import type { Sql } from "postgres"
import postgres from "postgres"
import "reflect-metadata"
import Note from "services/entities/Note"
import { postgresjsListCourtCases } from "services/postgresjsListCourtCases"
import { DataSource } from "typeorm"
import { isError } from "types/Result"
import createDbConfig from "utils/createDbConfig"
import CourtCase from "../../src/services/entities/CourtCase"
import Trigger from "../../src/services/entities/Trigger"
import getDataSource from "../../src/services/getDataSource"
import deleteFromEntity from "../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"

const dbConfig = createDbConfig()

jest.mock(
  "services/queries/courtCasesByVisibleForcesQuery",
  jest.fn(() =>
    jest.fn((query) => {
      return query
    })
  )
)

jest.setTimeout(100000)
describe("POSTGRESJS-listCourtCases", () => {
  let dataSource: DataSource
  let db: Sql

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
    await deleteFromEntity(Trigger)
    await deleteFromEntity(Note)
    db = postgres(dbConfig)
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  describe("search by defendant name", () => {
    it("should return all cases when no there is no filter set ", async () => {
      const orgCode = "01FPA1"
      const defendantToInclude = "WAYNE Bruce"
      const defendantToIncludeWithPartialMatch = "WAYNE Bill"
      const defendantToNotInclude = "GORDON Barbara"

      insertCourtCasesWithFields([
        { defendantName: defendantToInclude, orgForPoliceFilter: orgCode },
        { defendantName: defendantToNotInclude, orgForPoliceFilter: orgCode },
        { defendantName: defendantToIncludeWithPartialMatch, orgForPoliceFilter: orgCode }
      ])

      const result = await postgresjsListCourtCases(db)
      expect(result.length).toBe(3)
    })

    it("should list cases when there is partial and case insensitive match", async () => {
      const orgCode = "01FPA1"
      const defendantToInclude = "WAYNE Bruce"
      const defendantToIncludeWithPartialMatch = "WAYNE Bill"
      const defendantToNotInclude = "GORDON Barbara"

      insertCourtCasesWithFields([
        { defendantName: defendantToInclude, orgForPoliceFilter: orgCode },
        { defendantName: defendantToNotInclude, orgForPoliceFilter: orgCode },
        { defendantName: defendantToIncludeWithPartialMatch, orgForPoliceFilter: orgCode }
      ])
      let result = await postgresjsListCourtCases(db, { defendantName: "wayne bruce" })
      expect(result).toHaveLength(1)

      expect(result[0].defendant_name).toStrictEqual(defendantToInclude)

      result = await postgresjsListCourtCases(db, {
        defendantName: "wayne b"
      })

      expect(result).toHaveLength(2)
      expect(result[0].defendant_name).toStrictEqual(defendantToInclude)
      expect(result[1].defendant_name).toStrictEqual(defendantToIncludeWithPartialMatch)
    })
  })

  describe("search by court name", () => {
    it("should list cases when there is a case insensitive match", async () => {
      const orgCode = "01FPA1"
      const courtNameToInclude = "Magistrates' Courts London Croydon"
      const courtNameToIncludeWithPartialMatch = "Magistrates' Courts London Something Else"
      const courtNameToNotInclude = "Court Name not to include"

      await insertCourtCasesWithFields([
        { courtName: courtNameToInclude, orgForPoliceFilter: orgCode },
        { courtName: courtNameToIncludeWithPartialMatch, orgForPoliceFilter: orgCode },
        { courtName: courtNameToNotInclude, orgForPoliceFilter: orgCode }
      ])

      let result = await postgresjsListCourtCases(db, {
        courtName: "Magistrates' Courts London Croydon"
      })
      expect(isError(result)).toBe(false)

      expect(result).toHaveLength(1)
      expect(result[0].court_name).toStrictEqual(courtNameToInclude)

      result = await postgresjsListCourtCases(db, {
        courtName: "magistrates' courts london"
      })
      expect(isError(result)).toBe(false)

      expect(result).toHaveLength(2)
      expect(result[0].court_name).toStrictEqual(courtNameToInclude)
      expect(result[1].court_name).toStrictEqual(courtNameToIncludeWithPartialMatch)
    })
  })
  describe("Using a combination of filters", () => {
    it("Should filter Court name and defendant name", async () => {
      const orgCode = "01FPA1"
      const courtNameToInclude = "Magistrates' Courts London Croydon"
      const wrongCourtName = "The incorrect Court"
      const defendantToInclude = "WAYNE Bruce"
      const wrongDefendantName = "Ruce Bane"

      await insertCourtCasesWithFields([
        { courtName: courtNameToInclude, defendantName: wrongDefendantName, orgForPoliceFilter: orgCode },
        { courtName: wrongCourtName, defendantName: defendantToInclude, orgForPoliceFilter: orgCode },
        { courtName: courtNameToInclude, defendantName: defendantToInclude, orgForPoliceFilter: orgCode }
      ])

      const filteredCases = await postgresjsListCourtCases(db, {
        defendantName: "WAYNE Bruce",
        courtName: "Magistrates' Courts London Croydon"
      })
      console.log(filteredCases)
      expect(isError(filteredCases)).toBe(false)

      expect(filteredCases).toHaveLength(1)
      expect(filteredCases[0].court_name).toStrictEqual(courtNameToInclude)
      expect(filteredCases[0].defendant_name).toStrictEqual(defendantToInclude)
    })
  })
})

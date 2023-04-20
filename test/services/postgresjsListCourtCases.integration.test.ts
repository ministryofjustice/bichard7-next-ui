/* eslint-disable @typescript-eslint/naming-convention */
import "reflect-metadata"
import { DataSource } from "typeorm"
import deleteFromEntity from "../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"
import CourtCase from "../../src/services/entities/CourtCase"
import Trigger from "../../src/services/entities/Trigger"
import getDataSource from "../../src/services/getDataSource"
import Note from "services/entities/Note"
import { postgresjsListCourtCases } from "services/postgresjsListCourtCases"
import createDbConfig from "utils/createDbConfig"
import postgres from "postgres"
import type { Sql } from "postgres"

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
})

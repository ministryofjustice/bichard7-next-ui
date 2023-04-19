/* eslint-disable @typescript-eslint/naming-convention */
import "reflect-metadata"
import { DataSource } from "typeorm"
import deleteFromEntity from "../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"
import CourtCase from "../../src/services/entities/CourtCase"
import Trigger from "../../src/services/entities/Trigger"
import getDataSource from "../../src/services/getDataSource"
import Note from "services/entities/Note"
import { prismaListCourtCases } from "services/prismaListCourtCases"

jest.mock(
  "services/queries/courtCasesByVisibleForcesQuery",
  jest.fn(() =>
    jest.fn((query) => {
      return query
    })
  )
)

jest.setTimeout(100000)
describe("PRISMA-listCourtCases", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
    await deleteFromEntity(Trigger)
    await deleteFromEntity(Note)
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  describe("search by defendant name", () => {
    it.only("should return all cases when no there is no filter set ", async () => {
      const orgCode = "01FPA1"
      const defendantToInclude = "WAYNE Bruce"
      const defendantToIncludeWithPartialMatch = "WAYNE Bill"
      const defendantToNotInclude = "GORDON Barbara"

      await insertCourtCasesWithFields([
        { defendantName: defendantToInclude, orgForPoliceFilter: orgCode },
        { defendantName: defendantToNotInclude, orgForPoliceFilter: orgCode },
        { defendantName: defendantToIncludeWithPartialMatch, orgForPoliceFilter: orgCode }
      ])

      const result = await prismaListCourtCases()
      expect(result.length).toBe(3)
    })
  })
})

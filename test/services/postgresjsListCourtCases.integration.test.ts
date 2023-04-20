/* eslint-disable @typescript-eslint/naming-convention */
import "reflect-metadata"
import { DataSource } from "typeorm"
import deleteFromEntity from "../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"
import CourtCase from "../../src/services/entities/CourtCase"
import Trigger from "../../src/services/entities/Trigger"
import getDataSource from "../../src/services/getDataSource"
import Note from "services/entities/Note"
import { isError } from "types/Result"

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

      let result = await prismaListCourtCases()
      expect(result.length).toBe(3)

      result = await prismaListCourtCases({
        defendant_name: "WAYNE Bruce"
      })
      expect(isError(result)).toBe(false)
      expect(result).toHaveLength(1)
      expect(result[0].defendant_name).toStrictEqual(defendantToInclude)
    })

    it.only("should list cases when there is a case partial and insensitive match", async () => {
      const orgCode = "01FPA1"
      const defendantToInclude = "WAYNE Bruce"
      const defendantToIncludeWithPartialMatch = "WAYNE Bill"
      const defendantToNotInclude = "GORDON Barbara"

      await insertCourtCasesWithFields([
        { defendantName: defendantToInclude, orgForPoliceFilter: orgCode },
        { defendantName: defendantToNotInclude, orgForPoliceFilter: orgCode },
        { defendantName: defendantToIncludeWithPartialMatch, orgForPoliceFilter: orgCode }
      ])

      const result = await prismaListCourtCases({
        defendant_name: "wayne b"
      })
      expect(isError(result)).toBe(false)
      expect(result).toHaveLength(2)
      expect(result[0].defendant_name).toStrictEqual(defendantToInclude)
      expect(result[1].defendant_name).toStrictEqual(defendantToIncludeWithPartialMatch)
    })
  })
})

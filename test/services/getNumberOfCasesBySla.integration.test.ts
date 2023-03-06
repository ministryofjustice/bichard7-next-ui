/* eslint-disable @typescript-eslint/naming-convention */
import "reflect-metadata"
import { DataSource, SelectQueryBuilder } from "typeorm"
import MockDate from "mockdate"
import deleteFromTable from "../utils/deleteFromTable"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"
import { isError } from "../../src/types/Result"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import getNumberOfCasesBySla from "services/getNumberOfCasesBySla"
import { subDays } from "date-fns"
import courtCasesByVisibleForcesQuery from "services/queries/courtCasesByVisibleForcesQuery"

jest.mock(
  "services/queries/courtCasesByVisibleForcesQuery",
  jest.fn(() =>
    jest.fn((query) => {
      return query
    })
  )
)

jest.setTimeout(100000)
describe("listCourtCases", () => {
  let dataSource: DataSource
  const orgCode = "36FPA1"

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromTable(CourtCase)
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  afterEach(() => {
    MockDate.reset()
  })

  it("should call cases by visible forces query", async () => {
    await getNumberOfCasesBySla(dataSource, [orgCode])

    expect(courtCasesByVisibleForcesQuery).toHaveBeenCalledTimes(1)
    expect(courtCasesByVisibleForcesQuery).toHaveBeenCalledWith(expect.any(Object), [orgCode])
  })

  it("Should filter cases that within a specific date", async () => {
    const dateToday = new Date("2001-09-26")
    const dateYesterday = subDays(dateToday, 1)
    const dateDay2 = subDays(dateToday, 2)
    const dateDay3 = subDays(dateToday, 3)
    MockDate.set(dateToday)

    await insertCourtCasesWithFields([
      { courtDate: dateToday, orgForPoliceFilter: orgCode },
      { courtDate: dateToday, orgForPoliceFilter: orgCode },
      { courtDate: dateToday, orgForPoliceFilter: orgCode },
      { courtDate: dateToday, orgForPoliceFilter: orgCode },
      { courtDate: dateYesterday, orgForPoliceFilter: orgCode },
      { courtDate: dateYesterday, orgForPoliceFilter: orgCode },
      { courtDate: dateYesterday, orgForPoliceFilter: orgCode },
      { courtDate: dateDay2, orgForPoliceFilter: orgCode },
      { courtDate: dateDay2, orgForPoliceFilter: orgCode },
      { courtDate: dateDay3, orgForPoliceFilter: orgCode }
    ])

    const result = (await getNumberOfCasesBySla(dataSource, [orgCode])) as {
      countToday: number
      countYesterday: number
      countDay2: number
      countDay3: number
    }

    expect(isError(result)).toBeFalsy()

    expect(result.countToday).toEqual("4")
    expect(result.countYesterday).toEqual("3")
    expect(result.countDay2).toEqual("2")
    expect(result.countDay3).toEqual("1")
  })

  describe("When there is an error", () => {
    it("Should return the error when failed to unlock court case", async () => {
      jest.spyOn(SelectQueryBuilder.prototype, "getRawOne").mockRejectedValue(Error("Some error"))

      const result = await getNumberOfCasesBySla(dataSource, [orgCode])
      expect(isError(result)).toBe(true)

      const receivedError = result as Error

      expect(receivedError.message).toEqual("Some error")
    })
  })
})

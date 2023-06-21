/* eslint-disable @typescript-eslint/naming-convention */
import "reflect-metadata"
import { DataSource, SelectQueryBuilder } from "typeorm"
import MockDate from "mockdate"
import deleteFromEntity from "../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"
import { isError } from "../../src/types/Result"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import getCountOfCasesByCaseAge from "services/getCountOfCasesByCaseAge"
import { subDays } from "date-fns"
import courtCasesByOrganisationUnitQuery from "services/queries/courtCasesByOrganisationUnitQuery"
import type { KeyValuePair } from "types/KeyValuePair"
import User from "services/entities/User"

jest.mock(
  "services/queries/courtCasesByOrganisationUnitQuery",
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
    await deleteFromEntity(CourtCase)
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  afterEach(() => {
    MockDate.reset()
  })

  it("Should call cases by visible forces query", async () => {
    const user = { visibleCourts: [], visibleForces: [orgCode] } as Partial<User> as User
    await getCountOfCasesByCaseAge(dataSource, user)

    expect(courtCasesByOrganisationUnitQuery).toHaveBeenCalledTimes(1)
    expect(courtCasesByOrganisationUnitQuery).toHaveBeenCalledWith(expect.any(Object), user)
  })

  it("Should filter cases that within a specific date", async () => {
    const dateToday = new Date("2001-09-26")
    const dateYesterday = subDays(dateToday, 1)
    const dateDay2 = subDays(dateToday, 2)
    const dateDay3 = subDays(dateToday, 3)
    const dateDay14 = subDays(dateToday, 14)
    const firstDateOlderThanDay14 = subDays(dateToday, 15)
    const secondDateOlderThanDay14 = subDays(dateToday, 36)
    const thirdDateOlderThanDay14 = subDays(dateToday, 400)
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
      { courtDate: dateDay3, orgForPoliceFilter: orgCode },
      { courtDate: dateDay14, orgForPoliceFilter: orgCode },
      { courtDate: firstDateOlderThanDay14, orgForPoliceFilter: orgCode },
      { courtDate: secondDateOlderThanDay14, orgForPoliceFilter: orgCode },
      { courtDate: thirdDateOlderThanDay14, orgForPoliceFilter: orgCode }
    ])

    const result = (await getCountOfCasesByCaseAge(dataSource, {
      visibleCourts: [],
      visibleForces: [orgCode]
    } as Partial<User> as User)) as KeyValuePair<string, number>

    expect(isError(result)).toBeFalsy()

    expect(result.Today).toEqual("4")
    expect(result.Yesterday).toEqual("3")
    expect(result["Day 2"]).toEqual("2")
    expect(result["Day 3"]).toEqual("1")
    expect(result["Day 14"]).toEqual("1")
    expect(result["Day 15 and older"]).toEqual("3")
  })

  it("Should ignore resolved cases", async () => {
    const dateToday = new Date("2001-09-26")
    MockDate.set(dateToday)

    await insertCourtCasesWithFields([
      { courtDate: dateToday, orgForPoliceFilter: orgCode },
      { courtDate: dateToday, orgForPoliceFilter: orgCode },
      { courtDate: dateToday, orgForPoliceFilter: orgCode, resolutionTimestamp: new Date() }
    ])

    const result = (await getCountOfCasesByCaseAge(dataSource, {
      visibleCourts: [],
      visibleForces: [orgCode]
    } as Partial<User> as User)) as KeyValuePair<string, number>

    expect(isError(result)).toBeFalsy()

    expect(result.Today).toEqual("2")
  })

  describe("When there are no cases", () => {
    it("Should return 0 for each key", async () => {
      const result = (await getCountOfCasesByCaseAge(dataSource, {
        visibleCourts: [],
        visibleForces: [orgCode]
      } as Partial<User> as User)) as KeyValuePair<string, number>

      expect(isError(result)).toBeFalsy()

      expect(result.Today).toEqual("0")
      expect(result.Yesterday).toEqual("0")
      expect(result["Day 2"]).toEqual("0")
      expect(result["Day 3"]).toEqual("0")
      expect(result["Day 14"]).toEqual("0")
      expect(result["Day 15 and older"]).toEqual("0")
    })
  })

  describe("When there is an error", () => {
    it("Should return the error when failed to unlock court case", async () => {
      jest.spyOn(SelectQueryBuilder.prototype, "getRawOne").mockRejectedValue(Error("Some error"))

      const result = await getCountOfCasesByCaseAge(dataSource, {
        visibleCourts: [],
        visibleForces: [orgCode]
      } as Partial<User> as User)
      expect(isError(result)).toBe(true)

      const receivedError = result as Error

      expect(receivedError.message).toEqual("Some error")
    })
  })
})

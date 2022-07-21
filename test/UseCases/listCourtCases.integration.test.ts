/* eslint-disable @typescript-eslint/naming-convention */
import "reflect-metadata"
import { expect } from "@jest/globals"
import listCourtCases from "../../src/useCases/listCourtCases"
import deleteFromTable from "../testFixtures/database/deleteFromTable"
import {
  insertCourtCasesWithCourtDates,
  insertCourtCasesWithCourtNames,
  insertCourtCasesWithOrgCodes,
  insertCourtCasesWithDefendantNames
} from "../testFixtures/database/insertCourtCases"
import insertException from "../testFixtures/database/manageExceptions"
import { isError } from "../../src/types/Result"
import CourtCase from "../../src/entities/CourtCase"
import { DataSource } from "typeorm"
import getDataSource from "../../src/lib/getDataSource"
import { insertTriggers, TestTrigger } from "../testFixtures/database/manageTriggers"

jest.setTimeout(100000)

describe("listCourtCases", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromTable(CourtCase)
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it("shouldn't return more cases than the specified limit", async () => {
    await insertCourtCasesWithOrgCodes(Array.from(Array(100)).map(() => "36FPA1"))

    const result = await listCourtCases(dataSource, { forces: ["36FPA1"], limit: 10 })
    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(10)

    expect(cases[0].errorId).toBe(0)
    expect(cases[9].errorId).toBe(9)
    expect(cases[0].messageId).toBe("xxxx0")
    expect(cases[9].messageId).toBe("xxxx9")
  })

  it("should return a list of cases when the force code length is 1", async () => {
    await insertCourtCasesWithOrgCodes([
      "3",
      "36",
      "36F",
      "36FP",
      "36FPA",
      "36FPA1",
      "36FQ",
      "37F",
      "12LK",
      "12G",
      "12GHB",
      "12GHA",
      "12GHAB",
      "12GHAC"
    ])

    const result = await listCourtCases(dataSource, { forces: ["3"], limit: 100 })
    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(8)
    expect(cases.map((c) => c.orgForPoliceFilter)).toStrictEqual([
      "3     ",
      "36    ",
      "36F   ",
      "36FP  ",
      "36FPA ",
      "36FPA1",
      "36FQ  ",
      "37F   "
    ])
    expect(cases.map((c) => c.errorId)).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7])
  })

  it("should return a list of cases when the force code length is 2", async () => {
    await insertCourtCasesWithOrgCodes([
      "36",
      "36F",
      "36FP",
      "36FPA",
      "36FPA1",
      "36FQ",
      "12LK",
      "12G",
      "12GHB",
      "12GHA",
      "12GHAB",
      "12GHAC"
    ])

    const result = await listCourtCases(dataSource, { forces: ["36"], limit: 10 })
    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(6)
    expect(cases.map((c) => c.orgForPoliceFilter)).toStrictEqual([
      "36    ",
      "36F   ",
      "36FP  ",
      "36FPA ",
      "36FPA1",
      "36FQ  "
    ])
    expect(cases.map((c) => c.errorId)).toStrictEqual([0, 1, 2, 3, 4, 5])
  })

  it("should return a list of cases when the force code length is 3", async () => {
    await insertCourtCasesWithOrgCodes([
      "36",
      "36F",
      "36FP",
      "36FPA",
      "36FPA1",
      "36FQ",
      "12LK",
      "12G",
      "12GHB",
      "12GHA",
      "12GHAB",
      "12GHAC"
    ])

    const result = await listCourtCases(dataSource, { forces: ["36F"], limit: 10 })
    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(5)
    expect(cases.map((c) => c.orgForPoliceFilter)).toStrictEqual(["36F   ", "36FP  ", "36FPA ", "36FPA1", "36FQ  "])
    expect(cases.map((c) => c.errorId)).toStrictEqual([1, 2, 3, 4, 5])
  })

  it("should return a list of cases when the force code length is 4", async () => {
    await insertCourtCasesWithOrgCodes([
      "36",
      "36F",
      "36FP",
      "36FPA",
      "36FPA1",
      "36FQ",
      "12LK",
      "12G",
      "12GHB",
      "12GHA",
      "12GHAB",
      "12GHAC"
    ])

    const result = await listCourtCases(dataSource, { forces: ["36FP"], limit: 10 })
    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(3)
    expect(cases.map((c) => c.orgForPoliceFilter)).toStrictEqual(["36FP  ", "36FPA ", "36FPA1"])
    expect(cases.map((c) => c.errorId)).toStrictEqual([2, 3, 4])
  })

  it("a user with a visible force of length 5 can see cases for the 4-long prefix, and the exact match, and 6-long suffixes of the visible force", async () => {
    await insertCourtCasesWithOrgCodes(["12GH", "12LK", "12G", "12GHB", "12GHA", "12GHAB", "12GHAC", "13BR", "14AT"])

    const result = await listCourtCases(dataSource, { forces: ["12GHA"], limit: 10 })
    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(4)

    expect(cases[0].orgForPoliceFilter).toBe("12GH  ")
    expect(cases[1].orgForPoliceFilter).toBe("12GHA ")
    expect(cases[2].orgForPoliceFilter).toBe("12GHAB")
    expect(cases[3].orgForPoliceFilter).toBe("12GHAC")
  })

  it("shouldn't return non-visible cases when the force code length is 6", async () => {
    await insertCourtCasesWithOrgCodes([
      "36",
      "36F",
      "36FP",
      "36FPA",
      "36FPA1",
      "36FPA2",
      "36FQ",
      "12LK",
      "12G",
      "12GHB",
      "12GHA",
      "12GHAB",
      "12GHAC"
    ])

    const result = await listCourtCases(dataSource, { forces: ["36FPA1"], limit: 10 })
    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(3)

    expect(cases.map((c) => c.orgForPoliceFilter)).toStrictEqual(["36FP  ", "36FPA ", "36FPA1"])
    expect(cases.map((c) => c.errorId)).toStrictEqual([2, 3, 4])
  })

  it("should show cases for all forces visible to a user", async () => {
    await insertCourtCasesWithOrgCodes([
      "36",
      "36F",
      "36FP",
      "36FPA",
      "36FPA1",
      "36FPA2",
      "36FQ",
      "12LK",
      "12G",
      "12GHB",
      "12GHA",
      "12GHAB",
      "12GH",
      "13GH",
      "13GHA",
      "13GHA1",
      "13GHB",
      "13GHBA"
    ])

    const result = await listCourtCases(dataSource, { forces: ["36FPA1", "13GH"], limit: 100 })
    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(8)

    expect(cases.map((c) => c.orgForPoliceFilter)).toStrictEqual([
      "36FP  ",
      "36FPA ",
      "36FPA1",
      "13GH  ",
      "13GHA ",
      "13GHA1",
      "13GHB ",
      "13GHBA"
    ])
    expect(cases.map((c) => c.errorId)).toStrictEqual([2, 3, 4, 13, 14, 15, 16, 17])
  })

  it("should show no cases to a user with no visible forces", async () => {
    await insertCourtCasesWithOrgCodes([
      "36",
      "36F",
      "36FP",
      "36FPA",
      "36FPA1",
      "36FPA2",
      "36FQ",
      "12LK",
      "12G",
      "12GHB",
      "12GHA",
      "12GHAB",
      "12GH",
      "13GH",
      "13GHA",
      "13GHA1",
      "13GHB",
      "13GHBA"
    ])

    const result = await listCourtCases(dataSource, { forces: [], limit: 100 })
    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(0)
  })

  it("should order by court name", async () => {
    const orgCode = "36FPA1"
    await insertCourtCasesWithCourtNames(["BBBB", "CCCC", "AAAA"], orgCode)

    const resultAsc = await listCourtCases(dataSource, { forces: [orgCode], limit: 100, orderBy: "courtName" })
    expect(isError(resultAsc)).toBe(false)
    const casesAsc = resultAsc as CourtCase[]

    expect(casesAsc).toHaveLength(3)
    expect(casesAsc[0].courtName).toStrictEqual("AAAA")
    expect(casesAsc[1].courtName).toStrictEqual("BBBB")
    expect(casesAsc[2].courtName).toStrictEqual("CCCC")

    const resultDesc = await listCourtCases(dataSource, {
      forces: [orgCode],
      limit: 100,
      orderBy: "courtName",
      order: "desc"
    })
    expect(isError(resultDesc)).toBe(false)
    const casesDesc = resultDesc as CourtCase[]

    expect(casesDesc).toHaveLength(3)
    expect(casesDesc[0].courtName).toStrictEqual("CCCC")
    expect(casesDesc[1].courtName).toStrictEqual("BBBB")
    expect(casesDesc[2].courtName).toStrictEqual("AAAA")
  })

  it("should order by court date", async () => {
    const orgCode = "36FPA1"
    const firstDate = "2001-09-26"
    const secondDate = "2008-01-26"
    const thirdDate = "2013-10-16"

    await insertCourtCasesWithCourtDates([secondDate, firstDate, thirdDate], orgCode)

    const result = await listCourtCases(dataSource, { forces: [orgCode], limit: 100, orderBy: "courtDate" })
    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(3)
    expect(cases[0].courtDate).toStrictEqual(new Date(firstDate))
    expect(cases[1].courtDate).toStrictEqual(new Date(secondDate))
    expect(cases[2].courtDate).toStrictEqual(new Date(thirdDate))

    const resultDesc = await listCourtCases(dataSource, {
      forces: [orgCode],
      limit: 100,
      orderBy: "courtDate",
      order: "desc"
    })
    expect(isError(resultDesc)).toBe(false)
    const casesDesc = resultDesc as CourtCase[]

    expect(casesDesc).toHaveLength(3)
    expect(casesDesc[0].courtDate).toStrictEqual(new Date(thirdDate))
    expect(casesDesc[1].courtDate).toStrictEqual(new Date(secondDate))
    expect(casesDesc[2].courtDate).toStrictEqual(new Date(firstDate))
  })

  describe("filter by defendant name", () => {
    it("should list cases when there is a case insensitive match", async () => {
      const orgCode = "01FPA1"
      const defendantToInclude = "Bruce Wayne"
      const defendantToIncludeWithPartialMatch = "Bruce W. Ayne"
      const defendantToNotInclude = "Barbara Gordon"

      await insertCourtCasesWithDefendantNames(
        [defendantToInclude, defendantToNotInclude, defendantToIncludeWithPartialMatch],
        orgCode
      )

      let result = await listCourtCases(dataSource, { forces: [orgCode], limit: 100, defendantName: "Bruce Wayne" })
      expect(isError(result)).toBe(false)
      let cases = result as CourtCase[]

      expect(cases).toHaveLength(1)
      expect(cases[0].defendantName).toStrictEqual(defendantToInclude)

      result = await listCourtCases(dataSource, {
        forces: [orgCode],
        limit: 100,
        defendantName: "bruce w"
      })
      expect(isError(result)).toBe(false)
      cases = result as CourtCase[]

      expect(cases).toHaveLength(2)
      expect(cases[0].defendantName).toStrictEqual(defendantToInclude)
      expect(cases[1].defendantName).toStrictEqual(defendantToIncludeWithPartialMatch)
    })
  })

  describe("Filter cases having triggers/exceptions", () => {
    it("Should filter by whether a case has triggers", async () => {
      await insertCourtCasesWithOrgCodes(["01", "01"])

      const trigger: TestTrigger = {
        triggerId: 0,
        triggerCode: "TRPR0001",
        status: 0,
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
      await insertTriggers(0, [trigger])

      const result = await listCourtCases(dataSource, {
        forces: ["01"],
        limit: 100,
        resultFilter: "triggers"
      })

      expect(isError(result)).toBeFalsy()
      const courtCases = result as CourtCase[]

      expect(courtCases).toHaveLength(1)
      expect(courtCases[0].errorId).toBe(0)
    })

    it("Should filter by whether a case has excecptions", async () => {
      await insertCourtCasesWithOrgCodes(["01", "01"])
      await insertException(0, "HO100300")

      const result = await listCourtCases(dataSource, {
        forces: ["01"],
        limit: 100,
        resultFilter: "exceptions"
      })

      expect(isError(result)).toBeFalsy()
      const courtCases = result as CourtCase[]

      expect(courtCases).toHaveLength(1)
      expect(courtCases[0].errorId).toBe(0)
    })
  })
})

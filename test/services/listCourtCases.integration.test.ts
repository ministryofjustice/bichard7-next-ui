/* eslint-disable @typescript-eslint/naming-convention */
import "reflect-metadata"
import { DataSource } from "typeorm"
import listCourtCases from "../../src/services/listCourtCases"
import { ListCourtCaseResult } from "types/ListCourtCasesResult"
import deleteFromTable from "../utils/deleteFromTable"
import {
  insertCourtCasesWithCourtDates,
  insertCourtCasesWithCourtNames,
  insertCourtCasesWithOrgCodes,
  insertCourtCasesWithDefendantNames,
  insertDummyCourtCasesWithNotes,
  insertDummyCourtCasesWithTriggers,
  insertDummyCourtCasesWithUrgencies,
  getDummyCourtCase,
  insertCourtCases,
  insertMultipleDummyCourtCasesWithLock,
  insertMultipleDummyCourtCasesWithResolutionTimestamp
} from "../utils/insertCourtCases"
import insertException from "../utils/manageExceptions"
import { isError } from "../../src/types/Result"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import { insertTriggers, TestTrigger } from "../utils/manageTriggers"
import Note from "services/entities/Note"
import { ResolutionStatus } from "types/ResolutionStatus"

jest.setTimeout(100000)
const orgCodes = ["36", "36F", "36FP", "36FPA", "36FPA1", "36FQ", "12LK", "12G", "12GHB", "12GHA", "12GHAB", "12GHAC"]

describe("listCourtCases", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromTable(CourtCase)
    await deleteFromTable(Note)
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  it("should return cases with notes correctly", async () => {
    const caseNotes: { user: string; text: string }[][] = [
      [
        {
          user: "System",
          text: "System note 1"
        }
      ],
      [
        {
          user: "System",
          text: "System note 2"
        },
        {
          user: "bichard01",
          text: "Test note 1"
        },
        {
          user: "System",
          text: "System note 3"
        }
      ],
      [
        {
          user: "bichard01",
          text: "Test note 2"
        },
        {
          user: "bichard02",
          text: "Test note 3"
        },
        {
          user: "bichard01",
          text: "Test note 2"
        }
      ]
    ]

    const query = await insertDummyCourtCasesWithNotes(caseNotes, "01")
    expect(isError(query)).toBe(false)

    const result = await listCourtCases(dataSource, { forces: ["01"], maxPageItems: "100" })
    expect(isError(result)).toBe(false)
    const { result: cases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(3)

    expect(cases[0].notes).toHaveLength(1)
    expect(cases[1].notes).toHaveLength(3)
    expect(cases[2].notes).toHaveLength(3)
  })

  it("should return all the cases if they number less than or equal to the specified maxPageItems", async () => {
    await insertCourtCasesWithOrgCodes(Array.from(Array(100)).map(() => "36FPA1"))

    const result = await listCourtCases(dataSource, { forces: ["36FPA1"], maxPageItems: "100" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(100)

    expect(cases[0].errorId).toBe(0)
    expect(cases[9].errorId).toBe(9)
    expect(cases[0].messageId).toBe("xxxx0")
    expect(cases[9].messageId).toBe("xxxx9")
    expect(totalCases).toEqual(100)
  })

  it("shouldn't return more cases than the specified maxPageItems", async () => {
    await insertCourtCasesWithOrgCodes(Array.from(Array(100)).map(() => "36FPA1"))

    const result = await listCourtCases(dataSource, { forces: ["36FPA1"], maxPageItems: "10" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(10)

    expect(cases[0].errorId).toBe(0)
    expect(cases[9].errorId).toBe(9)
    expect(cases[0].messageId).toBe("xxxx0")
    expect(cases[9].messageId).toBe("xxxx9")
    expect(totalCases).toEqual(100)
  })

  it("shouldn't return more cases than the specified maxPageItems when cases have notes", async () => {
    const caseNote: { user: string; text: string }[] = [
      {
        user: "bichard01",
        text: "Test note 2"
      },
      {
        user: "bichard02",
        text: "Test note 3"
      },
      {
        user: "bichard01",
        text: "Test note 2"
      }
    ]

    const caseNotes: { user: string; text: string }[][] = new Array(100).fill(caseNote)

    await insertDummyCourtCasesWithNotes(caseNotes, "01")

    const result = await listCourtCases(dataSource, { forces: ["01"], maxPageItems: "10" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(10)
    expect(cases[0].notes[0].noteText).toBe("Test note 2")
    expect(totalCases).toEqual(100)
  })

  it("shouldn't return more cases than the specified maxPageItems when cases have triggers", async () => {
    const caseTrigger: { code: string; status: ResolutionStatus }[] = [
      {
        code: "TRPR0001",
        status: "Unresolved"
      },
      {
        code: "TRPR0002",
        status: "Resolved"
      },
      {
        code: "TRPR0003",
        status: "Submitted"
      }
    ]
    const caseTriggers: { code: string; status: ResolutionStatus }[][] = new Array(100).fill(caseTrigger)

    await insertDummyCourtCasesWithTriggers(caseTriggers, "01")

    const result = await listCourtCases(dataSource, { forces: ["01"], maxPageItems: "10" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(10)
    expect(cases[0].triggers[0].triggerCode).toBe("TRPR0001")
    expect(cases[0].triggers[0].status).toBe("Unresolved")
    expect(totalCases).toEqual(100)
  })

  it("should return the next page of items", async () => {
    await insertCourtCasesWithOrgCodes(Array.from(Array(100)).map(() => "36FPA1"))

    const result = await listCourtCases(dataSource, { forces: ["36FPA1"], maxPageItems: "10", pageNum: "2" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(10)

    expect(cases[0].errorId).toBe(10)
    expect(cases[9].errorId).toBe(19)
    expect(cases[0].messageId).toBe("xxx10")
    expect(cases[9].messageId).toBe("xxx19")
    expect(totalCases).toEqual(100)
  })

  it("should return the last page of items correctly", async () => {
    await insertCourtCasesWithOrgCodes(Array.from(Array(100)).map(() => "36FPA1"))

    const result = await listCourtCases(dataSource, { forces: ["36FPA1"], maxPageItems: "10", pageNum: "10" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(10)

    expect(cases[0].errorId).toBe(90)
    expect(cases[9].errorId).toBe(99)
    expect(cases[0].messageId).toBe("xxx90")
    expect(cases[9].messageId).toBe("xxx99")
    expect(totalCases).toEqual(100)
  })

  it("shouldn't return any cases if the page number is greater than the total pages", async () => {
    await insertCourtCasesWithOrgCodes(Array.from(Array(100)).map(() => "36FPA1"))

    const result = await listCourtCases(dataSource, { forces: ["36FPA1"], maxPageItems: "10", pageNum: "11" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(0)
    expect(totalCases).toEqual(100)
  })

  it("should return a list of cases when the force code length is 1", async () => {
    const orgCodesForceCodeLen1 = [
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
    ]
    await insertCourtCasesWithOrgCodes(orgCodesForceCodeLen1)

    const result = await listCourtCases(dataSource, { forces: ["3"], maxPageItems: "100" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

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
    expect(totalCases).toEqual(8)
  })

  it("should return a list of cases when the force code length is 2", async () => {
    await insertCourtCasesWithOrgCodes(orgCodes)

    const result = await listCourtCases(dataSource, { forces: ["36"], maxPageItems: "10" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

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
    expect(totalCases).toEqual(6)
  })

  it("should return a list of cases when the force code length is 3", async () => {
    await insertCourtCasesWithOrgCodes(orgCodes)

    const result = await listCourtCases(dataSource, { forces: ["36F"], maxPageItems: "10" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(5)
    expect(cases.map((c) => c.orgForPoliceFilter)).toStrictEqual(["36F   ", "36FP  ", "36FPA ", "36FPA1", "36FQ  "])
    expect(cases.map((c) => c.errorId)).toStrictEqual([1, 2, 3, 4, 5])
    expect(totalCases).toEqual(5)
  })

  it("should return a list of cases when the force code length is 4", async () => {
    await insertCourtCasesWithOrgCodes(orgCodes)

    const result = await listCourtCases(dataSource, { forces: ["36FP"], maxPageItems: "10" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(3)
    expect(cases.map((c) => c.orgForPoliceFilter)).toStrictEqual(["36FP  ", "36FPA ", "36FPA1"])
    expect(cases.map((c) => c.errorId)).toStrictEqual([2, 3, 4])
    expect(totalCases).toEqual(3)
  })

  it("a user with a visible force of length 5 can see cases for the 4-long prefix, and the exact match, and 6-long suffixes of the visible force", async () => {
    const orgCodesForVisibleForceLen5 = ["12GH", "12LK", "12G", "12GHB", "12GHA", "12GHAB", "12GHAC", "13BR", "14AT"]
    await insertCourtCasesWithOrgCodes(orgCodesForVisibleForceLen5)

    const result = await listCourtCases(dataSource, { forces: ["12GHA"], maxPageItems: "10" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(4)

    expect(cases[0].orgForPoliceFilter).toBe("12GH  ")
    expect(cases[1].orgForPoliceFilter).toBe("12GHA ")
    expect(cases[2].orgForPoliceFilter).toBe("12GHAB")
    expect(cases[3].orgForPoliceFilter).toBe("12GHAC")
    expect(totalCases).toEqual(4)
  })

  it("shouldn't return non-visible cases when the force code length is 6", async () => {
    const orgCodesForNonVisibleCases = [
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
    ]
    await insertCourtCasesWithOrgCodes(orgCodesForNonVisibleCases)

    const result = await listCourtCases(dataSource, { forces: ["36FPA1"], maxPageItems: "10" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(3)

    expect(cases.map((c) => c.orgForPoliceFilter)).toStrictEqual(["36FP  ", "36FPA ", "36FPA1"])
    expect(cases.map((c) => c.errorId)).toStrictEqual([2, 3, 4])
    expect(totalCases).toEqual(3)
  })

  it("should show cases for all forces visible to a user", async () => {
    const orgCodesForAllVisibleForces = [
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
    ]

    await insertCourtCasesWithOrgCodes(orgCodesForAllVisibleForces)

    const result = await listCourtCases(dataSource, { forces: ["36FPA1", "13GH"], maxPageItems: "100" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

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
    expect(totalCases).toEqual(8)
  })

  it("should show no cases to a user with no visible forces", async () => {
    const orgCodesForNoVisibleCases = [
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
    ]
    await insertCourtCasesWithOrgCodes(orgCodesForNoVisibleCases)

    const result = await listCourtCases(dataSource, { forces: [], maxPageItems: "100" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(0)
    expect(totalCases).toEqual(0)
  })

  it("should order by court name", async () => {
    const orgCode = "36FPA1"
    await insertCourtCasesWithCourtNames(["BBBB", "CCCC", "AAAA"], orgCode)

    const resultAsc = await listCourtCases(dataSource, { forces: [orgCode], maxPageItems: "100", orderBy: "courtName" })
    expect(isError(resultAsc)).toBe(false)
    const { result: casesAsc, totalCases: totalCasesAsc } = resultAsc as ListCourtCaseResult

    expect(casesAsc).toHaveLength(3)
    expect(casesAsc[0].courtName).toStrictEqual("AAAA")
    expect(casesAsc[1].courtName).toStrictEqual("BBBB")
    expect(casesAsc[2].courtName).toStrictEqual("CCCC")
    expect(totalCasesAsc).toEqual(3)

    const resultDesc = await listCourtCases(dataSource, {
      forces: [orgCode],
      maxPageItems: "100",
      orderBy: "courtName",
      order: "desc"
    })
    expect(isError(resultDesc)).toBe(false)
    const { result: casesDesc, totalCases: totalCasesDesc } = resultDesc as ListCourtCaseResult

    expect(casesDesc).toHaveLength(3)
    expect(casesDesc[0].courtName).toStrictEqual("CCCC")
    expect(casesDesc[1].courtName).toStrictEqual("BBBB")
    expect(casesDesc[2].courtName).toStrictEqual("AAAA")
    expect(totalCasesDesc).toEqual(3)
  })

  it("should order by court date", async () => {
    const orgCode = "36FPA1"
    const firstDate = new Date("2001-09-26")
    const secondDate = new Date("2008-01-26")
    const thirdDate = new Date("2013-10-16")

    await insertCourtCasesWithCourtDates([secondDate, firstDate, thirdDate], orgCode)

    const result = await listCourtCases(dataSource, { forces: [orgCode], maxPageItems: "100", orderBy: "courtDate" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(3)
    expect(cases[0].courtDate).toStrictEqual(new Date(firstDate))
    expect(cases[1].courtDate).toStrictEqual(new Date(secondDate))
    expect(cases[2].courtDate).toStrictEqual(new Date(thirdDate))
    expect(totalCases).toEqual(3)

    const resultDesc = await listCourtCases(dataSource, {
      forces: [orgCode],
      maxPageItems: "100",
      orderBy: "courtDate",
      order: "desc"
    })
    expect(isError(resultDesc)).toBe(false)
    const { result: casesDesc, totalCases: totalCasesDesc } = resultDesc as ListCourtCaseResult

    expect(casesDesc).toHaveLength(3)
    expect(casesDesc[0].courtDate).toStrictEqual(thirdDate)
    expect(casesDesc[1].courtDate).toStrictEqual(secondDate)
    expect(casesDesc[2].courtDate).toStrictEqual(firstDate)
    expect(totalCasesDesc).toEqual(3)
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

      let result = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        defendantName: "Bruce Wayne"
      })
      expect(isError(result)).toBe(false)
      let { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases[0].defendantName).toStrictEqual(defendantToInclude)

      result = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        defendantName: "bruce w"
      })
      expect(isError(result)).toBe(false)
      cases = (result as ListCourtCaseResult).result

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
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }
      await insertTriggers(0, [trigger])

      const result = await listCourtCases(dataSource, {
        forces: ["01"],
        maxPageItems: "100",
        reasons: ["Triggers"]
      })

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases[0].errorId).toBe(0)
    })

    it("Should filter by whether a case has excecptions", async () => {
      await insertCourtCasesWithOrgCodes(["01", "01"])
      await insertException(0, "HO100300")

      const result = await listCourtCases(dataSource, {
        forces: ["01"],
        maxPageItems: "100",
        reasons: ["Exceptions"]
      })

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases[0].errorId).toBe(0)
    })
  })

  describe("Filter cases by urgency", () => {
    it("Should filter only urgent cases", async () => {
      await insertDummyCourtCasesWithUrgencies([false, true, false, true], "01")

      const result = await listCourtCases(dataSource, {
        forces: ["01"],
        maxPageItems: "100",
        urgent: "Urgent"
      })

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(2)
      expect(cases.map((c) => c.errorId)).toStrictEqual([1, 3])
    })

    it("Should filter non-urgent cases", async () => {
      await insertDummyCourtCasesWithUrgencies([false, true, false, false], "01")

      const result = await listCourtCases(dataSource, {
        forces: ["01"],
        maxPageItems: "100",
        urgent: "Non-urgent"
      })

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(3)
    })

    it("Should not filter cases when the urgent filter is undefined", async () => {
      await insertDummyCourtCasesWithUrgencies([false, true, false, true], "01")

      const result = await listCourtCases(dataSource, {
        forces: ["01"],
        maxPageItems: "100"
      })

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(4)
    })
  })

  describe("Filter cases by court date", () => {
    it("Should filter cases that within a start and end date ", async () => {
      const orgCode = "36FPA1"
      const firstDate = new Date("2001-09-26")
      const secondDate = new Date("2008-01-26")
      const thirdDate = new Date("2008-03-26")
      const fourthDate = new Date("2013-10-16")

      await insertCourtCasesWithCourtDates([firstDate, secondDate, thirdDate, fourthDate], orgCode)

      const result = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        courtDateRange: { from: new Date("2008-01-01"), to: new Date("2008-12-31") }
      })

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(2)
      expect(cases.map((c) => c.errorId)).toStrictEqual([1, 2])
    })

    it("Should filter cases that within a specific date", async () => {
      const orgCode = "36FPA1"
      const firstDate = new Date("2001-09-26")
      const secondDate = new Date("2008-01-26")
      const thirdDate = new Date("2008-03-26")
      const fourthDate = new Date("2013-10-16")

      await insertCourtCasesWithCourtDates([firstDate, secondDate, thirdDate, fourthDate], orgCode)

      const result = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        courtDateRange: { from: new Date("2008-01-26"), to: new Date("2008-01-26") }
      })

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases.map((c) => c.errorId)).toStrictEqual([1])
    })
  })

  describe("Filter cases by locked status", () => {
    it("Should filter cases that are locked ", async () => {
      const orgCode = "36FP"
      await insertMultipleDummyCourtCasesWithLock(
        [{ errorLockedByUsername: "bichard01", triggerLockedByUsername: "bichard01" }, {}],
        orgCode
      )

      const result = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        locked: true
      })

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases.map((c) => c.errorId)).toStrictEqual([0])
    })

    it("Should filter cases that are unlocked ", async () => {
      const orgCode = "36FP"
      const lockedCase = await getDummyCourtCase({
        errorId: 0,
        errorLockedByUsername: "bichard01",
        triggerLockedByUsername: "bichard01",
        messageId: "0"
      })
      const unlockedCase = await getDummyCourtCase({
        errorId: 1,
        messageId: "1"
      })

      await insertCourtCases([lockedCase, unlockedCase])

      const result = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        locked: false
      })

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases.map((c) => c.errorId)).toStrictEqual([1])
    })

    it("Should treat cases with only one lock as locked.  ", async () => {
      const orgCode = "36FP"
      const errorLockedCase = await getDummyCourtCase({
        errorId: 0,
        errorLockedByUsername: "bichard01",
        messageId: "0"
      })
      const triggerLockedCase = await getDummyCourtCase({
        errorId: 1,
        triggerLockedByUsername: "bichard01",
        messageId: "1"
      })
      const unlockedCase = await getDummyCourtCase({
        errorId: 2,
        messageId: "2"
      })

      await insertCourtCases([errorLockedCase, triggerLockedCase, unlockedCase])

      const lockedResult = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        locked: true
      })

      expect(isError(lockedResult)).toBeFalsy()
      const { result: lockedCases } = lockedResult as ListCourtCaseResult

      expect(lockedCases).toHaveLength(2)
      expect(lockedCases.map((c) => c.errorId)).toStrictEqual([0, 1])

      const unlockedResult = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        locked: false
      })

      expect(isError(unlockedResult)).toBeFalsy()
      const { result: unlockedCases } = unlockedResult as ListCourtCaseResult

      expect(unlockedCases).toHaveLength(1)
      expect(unlockedCases.map((c) => c.errorId)).toStrictEqual([2])
    })
  })

  describe("Filter cases by case state", () => {
    it("Should filter cases that are unresolved ", async () => {
      const orgCode = "36FP"
      const dummyTimestamp = new Date()
      await insertMultipleDummyCourtCasesWithResolutionTimestamp(
        [null, dummyTimestamp, dummyTimestamp, dummyTimestamp],
        orgCode
      )

      const result = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        unresolved: true
      })

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases.map((c) => c.resolutionTimestamp)).toStrictEqual([null])
    })

    it("Should return all cases if a falsy value ", async () => {
      const orgCode = "36FP"
      const resolutionTimestamp = new Date()
      await insertMultipleDummyCourtCasesWithResolutionTimestamp(
        [null, resolutionTimestamp, resolutionTimestamp, resolutionTimestamp],
        orgCode
      )

      const result = await listCourtCases(dataSource, {
        forces: [orgCode],
        maxPageItems: "100",
        unresolved: false
      })

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(4)
      expect(cases.map((c) => c.resolutionTimestamp)).toStrictEqual([
        null,
        resolutionTimestamp,
        resolutionTimestamp,
        resolutionTimestamp
      ])
    })
  })
})

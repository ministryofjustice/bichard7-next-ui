/* eslint-disable @typescript-eslint/naming-convention */
import "reflect-metadata"
import Note from "services/entities/Note"
import User from "services/entities/User"
import courtCasesByOrganisationUnitQuery from "services/queries/courtCasesByOrganisationUnitQuery"
import leftJoinAndSelectTriggersQuery from "services/queries/leftJoinAndSelectTriggersQuery"
import { DataSource } from "typeorm"
import { CaseState, Reason } from "types/CaseListQueryParams"
import { ListCourtCaseResult } from "types/ListCourtCasesResult"
import { ResolutionStatus } from "types/ResolutionStatus"
import { UserGroup } from "types/UserGroup"
import CourtCase from "../../../src/services/entities/CourtCase"
import Trigger from "../../../src/services/entities/Trigger"
import getDataSource from "../../../src/services/getDataSource"
import listCourtCases from "../../../src/services/listCourtCases"
import { isError } from "../../../src/types/Result"
import {
  exceptionHandlerHasAccessTo,
  generalHandlerHasAccessTo,
  hasAccessToAll,
  hasAccessToNone,
  supervisorHasAccessTo,
  triggerAndExceptionHandlerHasAccessTo,
  triggerHandlerHasAccessTo
} from "../../helpers/hasAccessTo"
import deleteFromEntity from "../../utils/deleteFromEntity"
import {
  insertCourtCasesWithFields,
  insertDummyCourtCasesWithNotes,
  insertDummyCourtCasesWithTriggers,
  insertMultipleDummyCourtCases
} from "../../utils/insertCourtCases"
import insertException from "../../utils/manageExceptions"
import { TestTrigger, insertTriggers } from "../../utils/manageTriggers"

jest.mock("services/queries/courtCasesByOrganisationUnitQuery")
jest.mock("services/queries/leftJoinAndSelectTriggersQuery")

jest.setTimeout(100000)
describe("listCourtCases", () => {
  let dataSource: DataSource
  const orgCode = "36FPA1"
  const testUser = {
    visibleForces: [orgCode],
    visibleCourts: [],
    hasAccessTo: hasAccessToAll
  } as Partial<User> as User

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
    await deleteFromEntity(Trigger)
    await deleteFromEntity(Note)
    jest.resetAllMocks()
    jest.clearAllMocks()
    ;(courtCasesByOrganisationUnitQuery as jest.Mock).mockImplementation(
      jest.requireActual("services/queries/courtCasesByOrganisationUnitQuery").default
    )
    ;(leftJoinAndSelectTriggersQuery as jest.Mock).mockImplementation(
      jest.requireActual("services/queries/leftJoinAndSelectTriggersQuery").default
    )
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  it("Should call cases by organisation unit query", async () => {
    await listCourtCases(dataSource, { maxPageItems: "1" }, testUser)

    expect(courtCasesByOrganisationUnitQuery).toHaveBeenCalledTimes(1)
    expect(courtCasesByOrganisationUnitQuery).toHaveBeenCalledWith(expect.any(Object), testUser)
  })

  it("Should call leftJoinAndSelectTriggersQuery with the correct arguments", async () => {
    const excludedTriggers = ["TRPDUMMY"]
    const caseState = "Resolved"
    const excludedTriggersUser = Object.assign({ excludedTriggers: excludedTriggers }, testUser)

    await listCourtCases(dataSource, { maxPageItems: "1", caseState: caseState }, excludedTriggersUser)

    expect(leftJoinAndSelectTriggersQuery).toHaveBeenCalledTimes(1)
    expect(leftJoinAndSelectTriggersQuery).toHaveBeenCalledWith(expect.any(Object), excludedTriggers, caseState)
  })

  it("Should return cases with notes correctly", async () => {
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

    const query = await insertDummyCourtCasesWithNotes(caseNotes, orgCode)
    expect(isError(query)).toBe(false)

    const result = await listCourtCases(dataSource, { maxPageItems: "100" }, testUser)
    expect(isError(result)).toBe(false)
    const { result: cases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(3)

    expect(cases[0].notes).toHaveLength(1)
    expect(cases[1].notes).toHaveLength(3)
    expect(cases[2].notes).toHaveLength(3)
  })

  describe("Pagination", () => {
    it("Should return all the cases if they number less than or equal to the specified maxPageItems", async () => {
      await insertCourtCasesWithFields(Array.from(Array(100)).map(() => ({ orgForPoliceFilter: "36FPA1" })))

      const result = await listCourtCases(dataSource, { maxPageItems: "100" }, testUser)
      expect(isError(result)).toBe(false)
      const { result: cases, totalCases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(100)

      expect(cases[0].errorId).toBe(0)
      expect(cases[9].errorId).toBe(9)
      expect(totalCases).toEqual(100)
    })

    it("shouldn't return more cases than the specified maxPageItems", async () => {
      await insertCourtCasesWithFields(Array.from(Array(100)).map(() => ({ orgForPoliceFilter: "36FPA1" })))

      const result = await listCourtCases(dataSource, { maxPageItems: "10" }, testUser)
      expect(isError(result)).toBe(false)
      const { result: cases, totalCases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(10)

      expect(cases[0].errorId).toBe(0)
      expect(cases[9].errorId).toBe(9)
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

      const result = await listCourtCases(dataSource, { maxPageItems: "10" }, {
        visibleForces: ["01"],
        visibleCourts: [],
        hasAccessTo: hasAccessToAll
      } as Partial<User> as User)
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

      const result = await listCourtCases(dataSource, { maxPageItems: "10" }, {
        visibleForces: ["01"],
        visibleCourts: [],
        hasAccessTo: hasAccessToAll
      } as Partial<User> as User)
      expect(isError(result)).toBe(false)
      const { result: cases, totalCases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(10)
      expect(cases[0].triggers[0].triggerCode).toBe("TRPR0001")
      expect(cases[0].triggers[0].status).toBe("Unresolved")
      expect(totalCases).toEqual(100)
    })

    it("Should return the next page of items", async () => {
      await insertCourtCasesWithFields(Array.from(Array(100)).map(() => ({ orgForPoliceFilter: "36FPA1" })))

      const result = await listCourtCases(dataSource, { maxPageItems: "10", pageNum: "2" }, {
        visibleForces: ["36FPA1"],
        visibleCourts: [],
        hasAccessTo: hasAccessToAll
      } as Partial<User> as User)
      expect(isError(result)).toBe(false)
      const { result: cases, totalCases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(10)

      expect(cases[0].errorId).toBe(10)
      expect(cases[9].errorId).toBe(19)
      expect(totalCases).toEqual(100)
    })

    it("Should return the last page of items correctly", async () => {
      await insertCourtCasesWithFields(Array.from(Array(100)).map(() => ({ orgForPoliceFilter: orgCode })))

      const result = await listCourtCases(dataSource, { maxPageItems: "10", pageNum: "10" }, testUser)
      expect(isError(result)).toBe(false)
      const { result: cases, totalCases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(10)

      expect(cases[0].errorId).toBe(90)
      expect(cases[9].errorId).toBe(99)
      expect(totalCases).toEqual(100)
    })

    it("shouldn't return any cases if the page number is greater than the total pages", async () => {
      await insertCourtCasesWithFields(Array.from(Array(100)).map(() => ({ orgForPoliceFilter: orgCode })))

      const result = await listCourtCases(dataSource, { maxPageItems: "10", pageNum: "11" }, testUser)
      expect(isError(result)).toBe(false)
      const { result: cases, totalCases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(0)
      expect(totalCases).toEqual(100)
    })
  })

  it("Should order by court name", async () => {
    await insertCourtCasesWithFields(
      ["BBBB", "CCCC", "AAAA"].map((courtName) => ({ courtName: courtName, orgForPoliceFilter: orgCode }))
    )

    const resultAsc = await listCourtCases(dataSource, { maxPageItems: "100", orderBy: "courtName" }, testUser)
    expect(isError(resultAsc)).toBe(false)
    const { result: casesAsc, totalCases: totalCasesAsc } = resultAsc as ListCourtCaseResult

    expect(casesAsc).toHaveLength(3)
    expect(casesAsc[0].courtName).toStrictEqual("AAAA")
    expect(casesAsc[1].courtName).toStrictEqual("BBBB")
    expect(casesAsc[2].courtName).toStrictEqual("CCCC")
    expect(totalCasesAsc).toEqual(3)

    const resultDesc = await listCourtCases(
      dataSource,
      {
        maxPageItems: "100",
        orderBy: "courtName",
        order: "desc"
      },
      testUser
    )
    expect(isError(resultDesc)).toBe(false)
    const { result: casesDesc, totalCases: totalCasesDesc } = resultDesc as ListCourtCaseResult

    expect(casesDesc).toHaveLength(3)
    expect(casesDesc[0].courtName).toStrictEqual("CCCC")
    expect(casesDesc[1].courtName).toStrictEqual("BBBB")
    expect(casesDesc[2].courtName).toStrictEqual("AAAA")
    expect(totalCasesDesc).toEqual(3)
  })

  it("Should order by court date", async () => {
    const firstDate = new Date("2001-09-26")
    const secondDate = new Date("2008-01-26")
    const thirdDate = new Date("2013-10-16")

    await insertCourtCasesWithFields([
      { courtDate: secondDate, orgForPoliceFilter: orgCode },
      { courtDate: firstDate, orgForPoliceFilter: orgCode },
      { courtDate: thirdDate, orgForPoliceFilter: orgCode }
    ])

    const result = await listCourtCases(dataSource, { maxPageItems: "100", orderBy: "courtDate" }, testUser)
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(3)
    expect(cases[0].courtDate).toStrictEqual(new Date(firstDate))
    expect(cases[1].courtDate).toStrictEqual(new Date(secondDate))
    expect(cases[2].courtDate).toStrictEqual(new Date(thirdDate))
    expect(totalCases).toEqual(3)

    const resultDesc = await listCourtCases(
      dataSource,
      {
        maxPageItems: "100",
        orderBy: "courtDate",
        order: "desc"
      },
      testUser
    )
    expect(isError(resultDesc)).toBe(false)
    const { result: casesDesc, totalCases: totalCasesDesc } = resultDesc as ListCourtCaseResult

    expect(casesDesc).toHaveLength(3)
    expect(casesDesc[0].courtDate).toStrictEqual(thirdDate)
    expect(casesDesc[1].courtDate).toStrictEqual(secondDate)
    expect(casesDesc[2].courtDate).toStrictEqual(firstDate)
    expect(totalCasesDesc).toEqual(3)
  })

  describe("ordered by 'lockedBy' reason", () => {
    it("Should order by error reason as primary order", async () => {
      await insertCourtCasesWithFields(
        ["HO100100", "HO100101", "HO100102"].map((code) => ({
          errorReason: code,
          orgForPoliceFilter: orgCode
        }))
      )

      const resultAsc = await listCourtCases(dataSource, { maxPageItems: "100", orderBy: "reason" }, testUser)
      expect(isError(resultAsc)).toBe(false)
      const { result: casesAsc, totalCases: totalCasesAsc } = resultAsc as ListCourtCaseResult

      expect(casesAsc).toHaveLength(3)
      expect(casesAsc[0].errorReason).toStrictEqual("HO100100")
      expect(casesAsc[1].errorReason).toStrictEqual("HO100101")
      expect(casesAsc[2].errorReason).toStrictEqual("HO100102")
      expect(totalCasesAsc).toEqual(3)

      const resultDesc = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          orderBy: "reason",
          order: "desc"
        },
        testUser
      )
      expect(isError(resultDesc)).toBe(false)
      const { result: casesDesc, totalCases: totalCasesDesc } = resultDesc as ListCourtCaseResult

      expect(casesDesc).toHaveLength(3)
      expect(casesDesc[0].errorReason).toStrictEqual("HO100102")
      expect(casesDesc[1].errorReason).toStrictEqual("HO100101")
      expect(casesDesc[2].errorReason).toStrictEqual("HO100100")
      expect(totalCasesDesc).toEqual(3)
    })

    it("Should order by trigger reason as secondary order", async () => {
      await insertCourtCasesWithFields(
        ["TRPR0010", "TRPR0011", "TRPR0012"].map((code) => ({
          triggerReason: code,
          orgForPoliceFilter: orgCode
        }))
      )

      const resultAsc = await listCourtCases(dataSource, { maxPageItems: "100", orderBy: "reason" }, testUser)
      expect(isError(resultAsc)).toBe(false)
      const { result: casesAsc, totalCases: totalCasesAsc } = resultAsc as ListCourtCaseResult

      expect(casesAsc).toHaveLength(3)
      expect(casesAsc[0].triggerReason).toStrictEqual("TRPR0010")
      expect(casesAsc[1].triggerReason).toStrictEqual("TRPR0011")
      expect(casesAsc[2].triggerReason).toStrictEqual("TRPR0012")
      expect(totalCasesAsc).toEqual(3)

      const resultDesc = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          orderBy: "reason",
          order: "desc"
        },
        testUser
      )
      expect(isError(resultDesc)).toBe(false)
      const { result: casesDesc, totalCases: totalCasesDesc } = resultDesc as ListCourtCaseResult

      expect(casesDesc).toHaveLength(3)
      expect(casesDesc[0].triggerReason).toStrictEqual("TRPR0012")
      expect(casesDesc[1].triggerReason).toStrictEqual("TRPR0011")
      expect(casesDesc[2].triggerReason).toStrictEqual("TRPR0010")
      expect(totalCasesDesc).toEqual(3)
    })
  })

  it("Should order by notes number", async () => {
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

    await insertDummyCourtCasesWithNotes(caseNotes, orgCode)

    const resultAsc = await listCourtCases(dataSource, { maxPageItems: "100", orderBy: "notes" }, testUser)
    expect(isError(resultAsc)).toBe(false)
    const { result: casesAsc, totalCases: totalCasesAsc } = resultAsc as ListCourtCaseResult

    expect(casesAsc).toHaveLength(3)
    expect(casesAsc[0].notes).toHaveLength(1)
    expect(casesAsc[1].notes).toHaveLength(3)
    expect(casesAsc[2].notes).toHaveLength(3)
    expect(totalCasesAsc).toEqual(3)

    const resultDesc = await listCourtCases(
      dataSource,
      {
        maxPageItems: "100",
        orderBy: "notes",
        order: "desc"
      },
      testUser
    )
    expect(isError(resultDesc)).toBe(false)
    const { result: casesDesc, totalCases: totalCasesDesc } = resultDesc as ListCourtCaseResult

    expect(casesDesc).toHaveLength(3)
    expect(casesDesc[0].notes).toHaveLength(3)
    expect(casesDesc[1].notes).toHaveLength(3)
    expect(casesDesc[2].notes).toHaveLength(1)
    expect(totalCasesDesc).toEqual(3)
  })

  describe("ordered by 'lockedBy' username", () => {
    it("Should order by errorLockedByUsername as primary order and triggerLockedByUsername as secondary order", async () => {
      await insertCourtCasesWithFields([
        { errorLockedByUsername: "User1", triggerLockedByUsername: "User4", orgForPoliceFilter: orgCode },
        { errorLockedByUsername: "User1", triggerLockedByUsername: "User3", orgForPoliceFilter: orgCode },
        { errorLockedByUsername: "User2", triggerLockedByUsername: "User1", orgForPoliceFilter: orgCode }
      ])

      const resultAsc = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          orderBy: "lockedBy"
        },
        testUser
      )
      expect(isError(resultAsc)).toBe(false)
      const { result: casesAsc, totalCases: totalCasesAsc } = resultAsc as ListCourtCaseResult

      expect(casesAsc).toHaveLength(3)
      expect(casesAsc[0].errorLockedByUsername).toStrictEqual("User1")
      expect(casesAsc[0].triggerLockedByUsername).toStrictEqual("User3")
      expect(casesAsc[1].errorLockedByUsername).toStrictEqual("User1")
      expect(casesAsc[1].triggerLockedByUsername).toStrictEqual("User4")
      expect(casesAsc[2].errorLockedByUsername).toStrictEqual("User2")
      expect(casesAsc[2].triggerLockedByUsername).toStrictEqual("User1")
      expect(totalCasesAsc).toEqual(3)

      const resultDesc = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          orderBy: "lockedBy",
          order: "desc"
        },
        testUser
      )
      expect(isError(resultDesc)).toBe(false)
      const { result: casesDesc, totalCases: totalCasesDesc } = resultDesc as ListCourtCaseResult

      expect(casesDesc).toHaveLength(3)
      expect(casesDesc[0].errorLockedByUsername).toStrictEqual("User2")
      expect(casesDesc[0].triggerLockedByUsername).toStrictEqual("User1")
      expect(casesDesc[1].errorLockedByUsername).toStrictEqual("User1")
      expect(casesDesc[1].triggerLockedByUsername).toStrictEqual("User4")
      expect(casesDesc[2].errorLockedByUsername).toStrictEqual("User1")
      expect(casesDesc[2].triggerLockedByUsername).toStrictEqual("User3")
      expect(totalCasesDesc).toEqual(3)
    })
  })

  describe("search by defendant name", () => {
    it("Should list cases when there is a case insensitive match", async () => {
      const defendantToInclude = "WAYNE Bruce"
      const defendantToIncludeWithPartialMatch = "WAYNE Bill"
      const defendantToNotInclude = "GORDON Barbara"

      await insertCourtCasesWithFields([
        { defendantName: defendantToInclude, orgForPoliceFilter: orgCode },
        { defendantName: defendantToNotInclude, orgForPoliceFilter: orgCode },
        { defendantName: defendantToIncludeWithPartialMatch, orgForPoliceFilter: orgCode }
      ])

      let result = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          defendantName: "WAYNE Bruce"
        },
        testUser
      )
      expect(isError(result)).toBe(false)
      let { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases[0].defendantName).toStrictEqual(defendantToInclude)

      result = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          defendantName: "WAYNE B"
        },
        testUser
      )
      expect(isError(result)).toBe(false)
      cases = (result as ListCourtCaseResult).result

      expect(cases).toHaveLength(2)
      expect(cases[0].defendantName).toStrictEqual(defendantToInclude)
      expect(cases[1].defendantName).toStrictEqual(defendantToIncludeWithPartialMatch)
    })
  })

  describe("filter by cases allocated to me", () => {
    it("Should list cases that are locked to me", async () => {
      await insertCourtCasesWithFields([
        { errorLockedByUsername: "User1", triggerLockedByUsername: "User1", orgForPoliceFilter: orgCode },
        { errorLockedByUsername: "User2", triggerLockedByUsername: "User2", orgForPoliceFilter: orgCode },
        { errorLockedByUsername: "User3", triggerLockedByUsername: "User3", orgForPoliceFilter: orgCode }
      ])

      const resultBefore = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100"
        },
        testUser
      )
      expect(isError(resultBefore)).toBe(false)
      const { result: casesBefore, totalCases: totalCasesBefore } = resultBefore as ListCourtCaseResult

      expect(casesBefore).toHaveLength(3)
      expect(casesBefore[0].errorLockedByUsername).toStrictEqual("User1")
      expect(casesBefore[0].triggerLockedByUsername).toStrictEqual("User1")
      expect(casesBefore[1].errorLockedByUsername).toStrictEqual("User2")
      expect(casesBefore[1].triggerLockedByUsername).toStrictEqual("User2")
      expect(casesBefore[2].errorLockedByUsername).toStrictEqual("User3")
      expect(casesBefore[2].triggerLockedByUsername).toStrictEqual("User3")
      expect(totalCasesBefore).toEqual(3)

      const resultAfter = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          allocatedToUserName: "User1"
        },
        testUser
      )
      expect(isError(resultAfter)).toBe(false)
      const { result: casesAfter, totalCases: totalCasesAfter } = resultAfter as ListCourtCaseResult

      expect(casesAfter).toHaveLength(1)
      expect(casesAfter[0].errorLockedByUsername).toStrictEqual("User1")
      expect(casesAfter[0].triggerLockedByUsername).toStrictEqual("User1")
      expect(totalCasesAfter).toEqual(1)
    })

    it("Should list cases that have triggers locked to me", async () => {
      await insertCourtCasesWithFields([
        { triggerLockedByUsername: "User1", orgForPoliceFilter: orgCode },
        { triggerLockedByUsername: "User2", orgForPoliceFilter: orgCode },
        { triggerLockedByUsername: "User3", orgForPoliceFilter: orgCode }
      ])

      const resultBefore = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100"
        },
        testUser
      )
      expect(isError(resultBefore)).toBe(false)
      const { result: casesBefore, totalCases: totalCasesBefore } = resultBefore as ListCourtCaseResult

      expect(casesBefore).toHaveLength(3)
      expect(casesBefore[0].triggerLockedByUsername).toStrictEqual("User1")
      expect(casesBefore[1].triggerLockedByUsername).toStrictEqual("User2")
      expect(casesBefore[2].triggerLockedByUsername).toStrictEqual("User3")
      expect(totalCasesBefore).toEqual(3)

      const resultAfter = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          allocatedToUserName: "User1"
        },
        testUser
      )
      expect(isError(resultAfter)).toBe(false)
      const { result: casesAfter, totalCases: totalCasesAfter } = resultAfter as ListCourtCaseResult

      expect(casesAfter).toHaveLength(1)
      expect(casesAfter[0].triggerLockedByUsername).toStrictEqual("User1")
      expect(totalCasesAfter).toEqual(1)
    })

    it("Should list cases that have errors locked to me", async () => {
      await insertCourtCasesWithFields([
        { errorLockedByUsername: "User1", orgForPoliceFilter: orgCode },
        { errorLockedByUsername: "User2", orgForPoliceFilter: orgCode },
        { errorLockedByUsername: "User3", orgForPoliceFilter: orgCode }
      ])

      const resultBefore = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100"
        },
        testUser
      )
      expect(isError(resultBefore)).toBe(false)
      const { result: casesBefore, totalCases: totalCasesBefore } = resultBefore as ListCourtCaseResult

      expect(casesBefore).toHaveLength(3)
      expect(casesBefore[0].errorLockedByUsername).toStrictEqual("User1")
      expect(casesBefore[1].errorLockedByUsername).toStrictEqual("User2")
      expect(casesBefore[2].errorLockedByUsername).toStrictEqual("User3")
      expect(totalCasesBefore).toEqual(3)

      const resultAfter = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          allocatedToUserName: "User1"
        },
        testUser
      )
      expect(isError(resultAfter)).toBe(false)
      const { result: casesAfter, totalCases: totalCasesAfter } = resultAfter as ListCourtCaseResult

      expect(casesAfter).toHaveLength(1)
      expect(casesAfter[0].errorLockedByUsername).toStrictEqual("User1")
      expect(totalCasesAfter).toEqual(1)
    })
  })

  describe("search by court name", () => {
    it("Should list cases when there is a case insensitive match", async () => {
      const courtNameToInclude = "Magistrates' Courts London Croydon"
      const courtNameToIncludeWithPartialMatch = "Magistrates' Courts London Something Else"
      const courtNameToNotInclude = "Court Name not to include"

      await insertCourtCasesWithFields([
        { courtName: courtNameToInclude, orgForPoliceFilter: orgCode },
        { courtName: courtNameToIncludeWithPartialMatch, orgForPoliceFilter: orgCode },
        { courtName: courtNameToNotInclude, orgForPoliceFilter: orgCode }
      ])

      let result = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          courtName: "Magistrates' Courts London Croydon"
        },
        testUser
      )
      expect(isError(result)).toBe(false)
      let { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases[0].courtName).toStrictEqual(courtNameToInclude)

      result = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          courtName: "magistrates' courts london"
        },
        testUser
      )
      expect(isError(result)).toBe(false)
      cases = (result as ListCourtCaseResult).result

      expect(cases).toHaveLength(2)
      expect(cases[0].courtName).toStrictEqual(courtNameToInclude)
      expect(cases[1].courtName).toStrictEqual(courtNameToIncludeWithPartialMatch)
    })
  })

  describe("search by ptiurn", () => {
    it("Should list cases when there is a case insensitive match", async () => {
      const ptiurnToInclude = "01ZD0303908"
      const ptiurnToIncludeWithPartialMatch = "01ZD0303909"
      const ptiurnToNotInclude = "00000000000"

      await insertCourtCasesWithFields([
        { ptiurn: ptiurnToInclude, orgForPoliceFilter: orgCode },
        { ptiurn: ptiurnToIncludeWithPartialMatch, orgForPoliceFilter: orgCode },
        { ptiurn: ptiurnToNotInclude, orgForPoliceFilter: orgCode }
      ])

      let result = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          ptiurn: "01ZD0303908"
        },
        testUser
      )
      expect(isError(result)).toBe(false)
      let { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases[0].ptiurn).toStrictEqual(ptiurnToInclude)

      result = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          ptiurn: "01ZD030390"
        },
        testUser
      )
      expect(isError(result)).toBe(false)
      cases = (result as ListCourtCaseResult).result

      expect(cases).toHaveLength(2)
      expect(cases[0].ptiurn).toStrictEqual(ptiurnToInclude)
      expect(cases[1].ptiurn).toStrictEqual(ptiurnToIncludeWithPartialMatch)
    })
  })

  describe("search by reason", () => {
    it("Should list cases when there is a case insensitive match in triggers or exceptions", async () => {
      await insertCourtCasesWithFields(Array.from({ length: 4 }, () => ({ orgForPoliceFilter: orgCode })))

      const triggerToInclude: TestTrigger = {
        triggerId: 0,
        triggerCode: "TRPR0111",
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }

      const triggerToIncludePartialMatch: TestTrigger = {
        triggerId: 1,
        triggerCode: "TRPR2222",
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }

      const triggerNotToInclude: TestTrigger = {
        triggerId: 2,
        triggerCode: "TRPR9999",
        status: "Unresolved",
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      }

      const errorToInclude = "HO00001"
      const errorToIncludePartialMatch = "HO002222"
      const errorNotToInclude = "HO999999"

      await insertTriggers(0, [triggerToInclude, triggerToIncludePartialMatch])
      await insertException(1, errorToInclude, `${errorToInclude}||ds:XMLField`)
      await insertException(2, errorToIncludePartialMatch, `${errorToIncludePartialMatch}||ds:XMLField`)
      await insertException(3, errorNotToInclude, `${errorNotToInclude}||ds:XMLField`)
      await insertTriggers(3, [triggerNotToInclude])

      // Searching for a full matched trigger code
      let result = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          reasonCode: triggerToInclude.triggerCode
        },
        testUser
      )

      expect(isError(result)).toBe(false)
      let { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases[0].triggers[0].triggerCode).toStrictEqual(triggerToInclude.triggerCode)

      // Searching for a full matched error code
      result = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          reasonCode: errorToInclude
        },
        testUser
      )

      expect(isError(result)).toBe(false)
      cases = (result as ListCourtCaseResult).result

      expect(cases).toHaveLength(1)
      expect(cases[0].errorReason).toStrictEqual(errorToInclude)

      // Searching for a partial match error/trigger code
      result = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          reasonCode: "2222"
        },
        testUser
      )

      expect(isError(result)).toBe(false)
      cases = (result as ListCourtCaseResult).result

      expect(cases).toHaveLength(2)
      expect(cases[0].triggers[0].triggerCode).toStrictEqual(triggerToIncludePartialMatch.triggerCode)
      expect(cases[1].errorReason).toStrictEqual(errorToIncludePartialMatch)
    })

    it("Should list cases when there is a case insensitive match in any exceptions", async () => {
      await insertCourtCasesWithFields(Array.from({ length: 2 }, () => ({ orgForPoliceFilter: orgCode })))

      const errorToInclude = "HO100322"
      const anotherErrorToInclude = "HO100323"
      const errorNotToInclude = "HO200212"

      await insertException(0, errorToInclude, `${errorToInclude}||ds:OrganisationUnitCode`)
      await insertException(0, anotherErrorToInclude, `${anotherErrorToInclude}||ds:NextHearingDate`)
      await insertException(1, errorNotToInclude, `${errorNotToInclude}||ds:XMLField`)

      let result = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          reasonCode: errorToInclude
        },
        testUser
      )

      expect(isError(result)).toBe(false)
      let { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases[0].errorReport).toStrictEqual(
        `${errorToInclude}||ds:OrganisationUnitCode, ${anotherErrorToInclude}||ds:NextHearingDate`
      )

      result = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          reasonCode: anotherErrorToInclude
        },
        testUser
      )

      expect(isError(result)).toBe(false)
      cases = (result as ListCourtCaseResult).result

      expect(cases).toHaveLength(1)
      expect(cases[0].errorReport).toStrictEqual(
        `${errorToInclude}||ds:OrganisationUnitCode, ${anotherErrorToInclude}||ds:NextHearingDate`
      )
    })
  })

  describe("Filter cases having reason", () => {
    const testTrigger: TestTrigger = {
      triggerId: 0,
      triggerCode: "TRPR0001",
      status: "Unresolved",
      createdAt: new Date("2022-07-09T10:22:34.000Z")
    }
    const conditionalBailTrigger: TestTrigger = {
      triggerId: 0,
      triggerCode: "TRPR0010",
      status: "Unresolved",
      createdAt: new Date("2022-07-09T10:22:34.000Z")
    }
    const bailDirectionTrigger: TestTrigger = {
      triggerId: 0,
      triggerCode: "TRPR0019",
      status: "Unresolved",
      createdAt: new Date("2022-07-09T10:22:34.000Z")
    }
    const preChargeBailApplicationTrigger: TestTrigger = {
      triggerId: 0,
      triggerCode: "TRPR0019",
      status: "Unresolved",
      createdAt: new Date("2022-07-09T10:22:34.000Z")
    }

    it("Should filter by whether a case has triggers", async () => {
      await insertCourtCasesWithFields(Array.from({ length: 3 }, () => ({ orgForPoliceFilter: orgCode })))
      await insertTriggers(0, [testTrigger])
      await insertTriggers(1, [bailDirectionTrigger])

      const result = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          reasons: [Reason.Triggers]
        },
        testUser
      )

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(2)
      expect(cases[0].errorId).toBe(0)
      expect(cases[1].errorId).toBe(1)
    })

    it("Should filter by whether a case has excecptions", async () => {
      await insertCourtCasesWithFields(Array.from({ length: 2 }, () => ({ orgForPoliceFilter: orgCode })))
      await insertException(0, "HO100300")
      await insertTriggers(1, [testTrigger])

      const result = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          reasons: [Reason.Exceptions]
        },
        testUser
      )

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases[0].errorId).toBe(0)
    })

    it("Should filter cases that has bails", async () => {
      await insertCourtCasesWithFields(Array.from({ length: 5 }, () => ({ orgForPoliceFilter: orgCode })))
      await insertException(0, "HO100300")
      await insertTriggers(1, [testTrigger])
      await insertTriggers(2, [conditionalBailTrigger])
      await insertTriggers(3, [bailDirectionTrigger])
      await insertTriggers(4, [preChargeBailApplicationTrigger])

      const result = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          reasons: [Reason.Bails]
        },
        testUser
      )

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(3)
      expect(cases[0].errorId).toBe(2)
      expect(cases[1].errorId).toBe(3)
      expect(cases[2].errorId).toBe(4)
    })

    it("Should filter cases with all reasons", async () => {
      await insertCourtCasesWithFields(Array.from({ length: 4 }, () => ({ orgForPoliceFilter: orgCode })))
      await insertException(0, "HO100300")
      await insertTriggers(1, [testTrigger])
      await insertTriggers(2, [conditionalBailTrigger])

      const result = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          reasons: [Reason.Bails, Reason.Exceptions, Reason.Triggers]
        },
        testUser
      )

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(3)
      expect(cases[0].errorId).toBe(0)
      expect(cases[1].errorId).toBe(1)
      expect(cases[2].errorId).toBe(2)
    })
  })

  describe("Filter cases by urgency", () => {
    it("Should filter only urgent cases", async () => {
      await insertCourtCasesWithFields([
        { isUrgent: false, orgForPoliceFilter: orgCode },
        { isUrgent: true, orgForPoliceFilter: orgCode },
        { isUrgent: false, orgForPoliceFilter: orgCode },
        { isUrgent: true, orgForPoliceFilter: orgCode }
      ])

      const result = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          urgent: "Urgent"
        },
        testUser
      )

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(2)
      expect(cases.map((c) => c.errorId)).toStrictEqual([1, 3])
    })

    it("Should filter non-urgent cases", async () => {
      await insertCourtCasesWithFields([
        { isUrgent: false, orgForPoliceFilter: orgCode },
        { isUrgent: true, orgForPoliceFilter: orgCode },
        { isUrgent: false, orgForPoliceFilter: orgCode },
        { isUrgent: false, orgForPoliceFilter: orgCode }
      ])

      const result = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          urgent: "Non-urgent"
        },
        testUser
      )

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(3)
    })

    it("Should not filter cases when the urgent filter is undefined", async () => {
      await insertCourtCasesWithFields([
        { isUrgent: false, orgForPoliceFilter: orgCode },
        { isUrgent: true, orgForPoliceFilter: orgCode },
        { isUrgent: false, orgForPoliceFilter: orgCode },
        { isUrgent: true, orgForPoliceFilter: orgCode }
      ])

      const result = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100"
        },
        testUser
      )

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(4)
    })
  })

  describe("Filter cases by court date", () => {
    it("Should filter cases that within a start and end date ", async () => {
      const firstDate = new Date("2001-09-26")
      const secondDate = new Date("2008-01-26")
      const thirdDate = new Date("2008-03-26")
      const fourthDate = new Date("2013-10-16")

      await insertCourtCasesWithFields([
        { courtDate: firstDate, orgForPoliceFilter: orgCode },
        { courtDate: secondDate, orgForPoliceFilter: orgCode },
        { courtDate: thirdDate, orgForPoliceFilter: orgCode },
        { courtDate: fourthDate, orgForPoliceFilter: orgCode }
      ])

      const result = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          courtDateRange: { from: new Date("2008-01-01"), to: new Date("2008-12-31") }
        },
        testUser
      )

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(2)
      expect(cases.map((c) => c.errorId)).toStrictEqual([1, 2])
    })

    it("Should filter cases by multiple date ranges", async () => {
      const firstDate = new Date("2001-09-26")
      const secondDate = new Date("2008-01-26")
      const thirdDate = new Date("2008-03-26")
      const fourthDate = new Date("2013-10-16")

      await insertCourtCasesWithFields([
        { courtDate: firstDate, orgForPoliceFilter: orgCode },
        { courtDate: secondDate, orgForPoliceFilter: orgCode },
        { courtDate: thirdDate, orgForPoliceFilter: orgCode },
        { courtDate: fourthDate, orgForPoliceFilter: orgCode }
      ])

      const result = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          courtDateRange: [
            { from: new Date("2008-01-26"), to: new Date("2008-01-26") },
            { from: new Date("2008-03-26"), to: new Date("2008-03-26") },
            { from: new Date("2013-10-16"), to: new Date("2013-10-16") }
          ]
        },
        testUser
      )

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(3)
      expect(cases.map((c) => c.errorId)).toStrictEqual([1, 2, 3])
    })
  })

  describe("Filter cases by locked status", () => {
    it("Should filter cases that are locked ", async () => {
      await insertCourtCasesWithFields([
        { errorLockedByUsername: "Bichard01", triggerLockedByUsername: "Bichard01", orgForPoliceFilter: orgCode },
        { orgForPoliceFilter: orgCode }
      ])

      const result = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          locked: true
        },
        testUser
      )

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases.map((c) => c.errorId)).toStrictEqual([0])
    })

    it("Should filter cases that are unlocked ", async () => {
      const lockedCase = {
        errorId: 0,
        errorLockedByUsername: "bichard01",
        triggerLockedByUsername: "bichard01"
      }
      const unlockedCase = {
        errorId: 1
      }

      await insertCourtCasesWithFields([lockedCase, unlockedCase])

      const result = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          locked: false
        },
        testUser
      )

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases.map((c) => c.errorId)).toStrictEqual([1])
    })

    it("Should treat cases with only one lock as locked.  ", async () => {
      await insertCourtCasesWithFields([
        {
          errorId: 0,
          errorLockedByUsername: "bichard01"
        },
        {
          errorId: 1,
          triggerLockedByUsername: "bichard01"
        },
        {
          errorId: 2
        }
      ])

      const lockedResult = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          locked: true
        },
        testUser
      )

      expect(isError(lockedResult)).toBeFalsy()
      const { result: lockedCases } = lockedResult as ListCourtCaseResult

      expect(lockedCases).toHaveLength(2)
      expect(lockedCases.map((c) => c.errorId)).toStrictEqual([0, 1])

      const unlockedResult = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          locked: false
        },
        testUser
      )

      expect(isError(unlockedResult)).toBeFalsy()
      const { result: unlockedCases } = unlockedResult as ListCourtCaseResult

      expect(unlockedCases).toHaveLength(1)
      expect(unlockedCases.map((c) => c.errorId)).toStrictEqual([2])
    })
  })

  describe("Filter cases by case state", () => {
    it("Should return unresolved cases if case state not set", async () => {
      const resolutionTimestamp = new Date()
      await insertCourtCasesWithFields(
        [null, resolutionTimestamp, resolutionTimestamp, resolutionTimestamp].map((timeStamp) => ({
          resolutionTimestamp: timeStamp,
          orgForPoliceFilter: orgCode
        }))
      )

      const result = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100"
        },
        testUser
      )

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(1)
      expect(cases.map((c) => c.resolutionTimestamp)).toStrictEqual([null])
    })

    it("Should filter cases that are resolved", async () => {
      const resolutionTimestamp = new Date()
      await insertCourtCasesWithFields(
        [null, resolutionTimestamp, resolutionTimestamp, resolutionTimestamp].map((timeStamp) => ({
          resolutionTimestamp: timeStamp,
          orgForPoliceFilter: orgCode
        }))
      )

      const result = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          caseState: "Resolved"
        },
        testUser
      )

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(3)
      expect(cases.map((c) => c.resolutionTimestamp)).toStrictEqual([
        resolutionTimestamp,
        resolutionTimestamp,
        resolutionTimestamp
      ])
    })

    it("Should only include 'Unresolved' triggers when caseState is not set", async () => {
      const caseOneTriggers: { code: string; status: ResolutionStatus }[] = [
        {
          code: "TRPR0001",
          status: "Unresolved"
        }
      ]

      const caseTwoTriggers: { code: string; status: ResolutionStatus }[] = [
        {
          code: "TRPR0001",
          status: "Resolved"
        },
        {
          code: "TRPR0002",
          status: "Resolved"
        }
      ]
      await insertDummyCourtCasesWithTriggers([caseOneTriggers, caseTwoTriggers], orgCode)

      const result = await listCourtCases(dataSource, { maxPageItems: "100" }, testUser)
      expect(isError(result)).toBe(false)
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(2)
      expect(cases[0].triggers).toHaveLength(1)
      expect(cases[1].triggers).toHaveLength(0)

      expect(leftJoinAndSelectTriggersQuery).toHaveBeenCalledTimes(1)
      expect(leftJoinAndSelectTriggersQuery).toHaveBeenCalledWith(expect.any(Object), undefined, "Unresolved")
    })
  })

  describe("Filter cases by resolution status", () => {
    //TODO: move this test
    it("Should show supervisors all resolved cases for their force", async () => {
      const resolutionTimestamp = new Date()
      const casesToInsert: Partial<CourtCase>[] = [undefined, "Bichard01", "Supervisor", "Bichard02", undefined].map(
        (resolver) => ({
          resolutionTimestamp: resolver !== undefined ? resolutionTimestamp : null,
          errorResolvedTimestamp: resolver !== undefined ? resolutionTimestamp : null,
          errorResolvedBy: resolver ?? null,
          orgForPoliceFilter: orgCode
        })
      )

      await insertCourtCasesWithFields(casesToInsert)

      const result = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          caseState: "Resolved"
        },
        testUser
      )

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(3)
      expect(cases.map((c) => c.errorId)).toStrictEqual([1, 2, 3])
    })

    it("Should show handlers cases that they resolved", async () => {
      const resolutionTimestamp = new Date()
      const thisUser = "Bichard01"
      const otherUser = "Bichard02"
      const casesToInsert: Partial<CourtCase>[] = [thisUser, otherUser, thisUser, otherUser].map((user) => ({
        resolutionTimestamp: resolutionTimestamp,
        orgForPoliceFilter: orgCode,
        errorResolvedBy: user
      }))

      await insertCourtCasesWithFields(casesToInsert)

      const result = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          caseState: "Resolved",
          resolvedByUsername: thisUser
        },
        testUser
      )

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(2)
      expect(cases.map((c) => c.errorId)).toStrictEqual([0, 2])
    })

    // TODO move these:
    it("Should show handlers cases that they resolved a trigger for", async () => {
      const resolutionTimestamp = new Date()
      const thisUser = "Bichard01"
      const otherUser = "Bichard02"
      const casesToInsert: Partial<CourtCase>[] = [
        {
          resolutionTimestamp: resolutionTimestamp,
          orgForPoliceFilter: orgCode,
          errorResolvedBy: otherUser
        },
        {
          resolutionTimestamp: resolutionTimestamp,
          orgForPoliceFilter: orgCode,
          errorResolvedBy: otherUser
        },
        {
          resolutionTimestamp: resolutionTimestamp,
          orgForPoliceFilter: orgCode,
          errorResolvedBy: otherUser,
          triggerResolvedBy: thisUser
        }
      ]

      await insertCourtCasesWithFields(casesToInsert)

      await insertTriggers(0, [
        {
          triggerId: 0,
          triggerCode: "TRPR0010",
          status: "Resolved",
          createdAt: resolutionTimestamp,
          resolvedAt: resolutionTimestamp,
          resolvedBy: thisUser
        }
      ])

      const result = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          caseState: "Resolved",
          resolvedByUsername: thisUser
        },
        testUser
      )

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      expect(cases).toHaveLength(2)
      expect(cases.map((c) => c.errorId)).toStrictEqual([0, 2])
    })
  })

  // TODO: move these
  describe("Filter cases by user role", () => {
    const mixedReasonCases: Partial<CourtCase>[] = [
      {
        errorId: 0,
        triggerCount: 2,
        errorCount: 0
      },
      {
        errorId: 1,
        triggerCount: 0,
        errorCount: 0
      },
      {
        errorId: 2,
        triggerCount: 0,
        errorCount: 2
      },
      {
        errorId: 3,
        triggerCount: 5,
        errorCount: 2
      }
    ]

    const noGroupsUser = {
      visibleForces: [orgCode],
      visibleCourts: [],
      groups: [],
      hasAccessTo: hasAccessToNone
    } as Partial<User> as User
    const triggerHandlerUser = {
      visibleForces: [orgCode],
      visibleCourts: [],
      groups: [UserGroup.TriggerHandler],
      hasAccessTo: triggerHandlerHasAccessTo
    } as Partial<User> as User
    const exceptionHandlerUser = {
      visibleForces: [orgCode],
      visibleCourts: [],
      groups: [UserGroup.ExceptionHandler],
      hasAccessTo: exceptionHandlerHasAccessTo
    } as Partial<User> as User
    const triggerAndExceptionHandlerUser = {
      visibleForces: [orgCode],
      visibleCourts: [],
      groups: [UserGroup.TriggerHandler, UserGroup.ExceptionHandler],
      hasAccessTo: triggerAndExceptionHandlerHasAccessTo
    } as Partial<User> as User
    const generalHandlerUser = {
      visibleForces: [orgCode],
      visibleCourts: [],
      groups: [UserGroup.GeneralHandler],
      hasAccessTo: generalHandlerHasAccessTo
    } as Partial<User> as User
    const supervisorUser = {
      visibleForces: [orgCode],
      visibleCourts: [],
      groups: [UserGroup.Supervisor],
      hasAccessTo: supervisorHasAccessTo
    } as Partial<User> as User

    it("Shouldn't show cases to a user with no permissions", async () => {
      await insertMultipleDummyCourtCases(10, orgCode)

      const result = await listCourtCases(dataSource, { maxPageItems: "100" }, noGroupsUser)

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult
      expect(cases).toHaveLength(0)
    })

    it("Shouldn't show cases to a user with no permissions when a reason filter is passed", async () => {
      await insertMultipleDummyCourtCases(10, orgCode)
      await insertTriggers(0, [{ triggerId: 0, triggerCode: "TRPR0010", status: "Unresolved", createdAt: new Date() }])

      const result = await listCourtCases(dataSource, { maxPageItems: "100", reasons: [Reason.Triggers] }, noGroupsUser)

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult
      expect(cases).toHaveLength(0)
    })

    it("Should show only cases with triggers to a trigger handler", async () => {
      await insertCourtCasesWithFields(mixedReasonCases)

      const result = await listCourtCases(dataSource, { maxPageItems: "100" }, triggerHandlerUser)

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      const returnedCaseIDs = cases.map((c) => c.errorId).sort()
      const expectedCaseIDs = mixedReasonCases
        .filter((c) => c.triggerCount! > 0)
        .map((c) => c.errorId)
        .sort()
      expect(cases).toHaveLength(expectedCaseIDs.length)
      expect(returnedCaseIDs).toStrictEqual(expectedCaseIDs)
    })

    it("Should only show cases with both triggers and exceptions to a trigger handler when trying to filter for exceptions", async () => {
      await insertCourtCasesWithFields(mixedReasonCases)

      const result = await listCourtCases(
        dataSource,
        { maxPageItems: "100", reasons: [Reason.Exceptions] },
        triggerHandlerUser
      )

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      const returnedCaseIDs = cases.map((c) => c.errorId).sort()
      const expectedCaseIDs = mixedReasonCases
        .filter((c) => c.triggerCount! > 0 && c.errorCount! > 0)
        .map((c) => c.errorId)
        .sort()
      expect(cases).toHaveLength(expectedCaseIDs.length)
      expect(returnedCaseIDs).toStrictEqual(expectedCaseIDs)
    })

    it("Should show only cases with exceptions to an exception handler", async () => {
      await insertCourtCasesWithFields(mixedReasonCases)

      const result = await listCourtCases(dataSource, { maxPageItems: "100" }, exceptionHandlerUser)

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      const returnedCaseIDs = cases.map((c) => c.errorId).sort()
      const expectedCaseIDs = mixedReasonCases
        .filter((c) => c.errorCount! > 0)
        .map((c) => c.errorId)
        .sort()
      expect(cases).toHaveLength(expectedCaseIDs.length)
      expect(returnedCaseIDs).toStrictEqual(expectedCaseIDs)
    })

    it("Should only show cases with both triggers and exceptions to an exception handler when trying to filter for triggers", async () => {
      await insertCourtCasesWithFields(mixedReasonCases)

      const result = await listCourtCases(
        dataSource,
        { maxPageItems: "100", reasons: [Reason.Triggers] },
        exceptionHandlerUser
      )

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      const returnedCaseIDs = cases.map((c) => c.errorId).sort()
      const expectedCaseIDs = mixedReasonCases
        .filter((c) => c.triggerCount! > 0 && c.errorCount! > 0)
        .map((c) => c.errorId)
        .sort()
      expect(cases).toHaveLength(expectedCaseIDs.length)
      expect(returnedCaseIDs).toStrictEqual(expectedCaseIDs)
    })

    it("Should show all cases to a user with both trigger handler and general handler permissions", async () => {
      await insertCourtCasesWithFields(mixedReasonCases)

      const result = await listCourtCases(dataSource, { maxPageItems: "100" }, triggerAndExceptionHandlerUser)

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      const returnedCaseIDs = cases.map((c) => c.errorId).sort()
      const expectedCaseIDs = mixedReasonCases.map((c) => c.errorId).sort()
      expect(cases).toHaveLength(expectedCaseIDs.length)
      expect(returnedCaseIDs).toStrictEqual(expectedCaseIDs)
    })

    it("Should show all cases to a general handler", async () => {
      await insertCourtCasesWithFields(mixedReasonCases)

      const result = await listCourtCases(dataSource, { maxPageItems: "100" }, generalHandlerUser)

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      const returnedCaseIDs = cases.map((c) => c.errorId).sort()
      const expectedCaseIDs = mixedReasonCases.map((c) => c.errorId).sort()
      expect(cases).toHaveLength(expectedCaseIDs.length)
      expect(returnedCaseIDs).toStrictEqual(expectedCaseIDs)
    })

    it("Should show all cases to a supervisor", async () => {
      await insertCourtCasesWithFields(mixedReasonCases)

      const result = await listCourtCases(dataSource, { maxPageItems: "100" }, supervisorUser)

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      const returnedCaseIDs = cases.map((c) => c.errorId).sort()
      const expectedCaseIDs = mixedReasonCases.map((c) => c.errorId).sort()
      expect(cases).toHaveLength(expectedCaseIDs.length)
      expect(returnedCaseIDs).toStrictEqual(expectedCaseIDs)
    })
  })
})

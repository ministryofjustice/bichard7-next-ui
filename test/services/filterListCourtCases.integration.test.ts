import { isError } from "lodash"
import CourtCase from "services/entities/CourtCase"
import Note from "services/entities/Note"
import Trigger from "services/entities/Trigger"
import User from "services/entities/User"
import getDataSource from "services/getDataSource"
import listCourtCases from "services/listCourtCases"
import courtCasesByOrganisationUnitQuery from "services/queries/courtCasesByOrganisationUnitQuery"
import leftJoinAndSelectTriggersQuery from "services/queries/leftJoinAndSelectTriggersQuery"
import { DataSource } from "typeorm"
import { CaseState } from "types/CaseListQueryParams"
import { ListCourtCaseResult } from "types/ListCourtCasesResult"
import { ResolutionStatus } from "types/ResolutionStatus"
import { exceptionHandlerHasAccessTo } from "../helpers/hasAccessTo"
import deleteFromEntity from "../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"
import insertException from "../utils/manageExceptions"
import { TestTrigger, insertTriggers } from "../utils/manageTriggers"

jest.mock("services/queries/courtCasesByOrganisationUnitQuery")
jest.mock("services/queries/leftJoinAndSelectTriggersQuery")

jest.setTimeout(100000)
describe("listCourtCases", () => {
  let dataSource: DataSource
  const orgCode = "36FPA1"

  const exceptionHandlerUser = {
    visibleForces: [orgCode],
    visibleCourts: [],
    hasAccessTo: exceptionHandlerHasAccessTo
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

  describe("Filter cases having a combination of behaviours for Exception Handlers and Trigger Handlers", () => {
    const dummyTriggerCode = "TRPR0001"
    const bailsTriggerCode = "TRPR0010"
    const getTrigger = (triggerCode: string, status: ResolutionStatus): TestTrigger => {
      return {
        triggerCode: triggerCode,
        status: status,
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      } as TestTrigger
    }

    beforeEach(async () => {
      await insertCourtCasesWithFields([
        {
          defendantName: "Triggers Resolved/Exceptions Unresolved",
          orgForPoliceFilter: orgCode,
          triggerResolvedBy: "Dummy user",
          triggerResolvedTimestamp: new Date(),
          triggerStatus: "Resolved"
        },
        {
          defendantName: "Exceptions Resolved/Triggers Unresolved",
          orgForPoliceFilter: orgCode,
          errorResolvedBy: "Dummy user",
          errorResolvedTimestamp: new Date(),
          errorStatus: "Resolved"
        },
        {
          defendantName: "Everything Resolved",
          orgForPoliceFilter: orgCode,
          triggerResolvedBy: "Dummy user",
          triggerResolvedTimestamp: new Date(),
          triggerStatus: "Resolved",
          errorResolvedBy: "Dummy user",
          errorResolvedTimestamp: new Date(),
          errorStatus: "Resolved",
          resolutionTimestamp: new Date()
        },
        { defendantName: "Everything Unresolved", orgForPoliceFilter: orgCode },
        {
          defendantName: "Bails Resolved/No Exceptions",
          orgForPoliceFilter: orgCode,
          triggerResolvedBy: "Dummy user",
          triggerResolvedTimestamp: new Date(),
          resolutionTimestamp: new Date(),
          triggerStatus: "Resolved"
        },
        { defendantName: "Bails Unresolved/No Exceptions", orgForPoliceFilter: orgCode }
      ])
      await insertTriggers(0, [getTrigger(dummyTriggerCode, "Resolved")])
      await insertException(0, "HO100300", undefined, "Unresolved")

      await insertTriggers(1, [getTrigger(dummyTriggerCode, "Unresolved")])
      await insertException(1, "HO100300", undefined, "Resolved")

      await insertTriggers(2, [getTrigger(dummyTriggerCode, "Resolved")])
      await insertException(2, "HO100300", undefined, "Resolved")

      await insertTriggers(3, [getTrigger(dummyTriggerCode, "Unresolved")])
      await insertException(3, "HO100300", undefined, "Unresolved")

      await insertTriggers(4, [getTrigger(bailsTriggerCode, "Resolved")])
      await insertTriggers(5, [getTrigger(bailsTriggerCode, "Unresolved")])
    })

    const testCases: { description: string; caseState: CaseState; user: User; expectedCases: string[] }[] = [
      {
        description:
          "Should see cases with unresolved exceptions when user is an exception handler and unresolved filter applied",
        caseState: "Unresolved",
        user: exceptionHandlerUser,
        expectedCases: ["Triggers Resolved/Exceptions Unresolved", "Everything Unresolved"]
      },
      {
        description:
          "Should see cases with resolved exceptions when user is an exception handler and resolved filter applied",
        caseState: "Resolved",
        user: exceptionHandlerUser,
        expectedCases: ["Exceptions Resolved/Triggers Unresolved", "Everything Resolved"]
      }
    ]

    it.each(testCases)("$description", async ({ caseState, user, expectedCases }) => {
      const result = await listCourtCases(
        dataSource,
        {
          maxPageItems: "100",
          caseState: caseState
        },
        user
      )

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      console.log("cases:", cases)

      expect(cases).toHaveLength(expectedCases.length)

      for (let i = 0; i < expectedCases.length; i++) {
        expect(cases[i].defendantName).toBe(expectedCases[i])
      }
    })
  })
})

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
import {
  exceptionHandlerHasAccessTo,
  // generalHandlerHasAccessTo,
  triggerHandlerHasAccessTo
} from "../helpers/hasAccessTo"
import deleteFromEntity from "../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"
import insertException from "../utils/manageExceptions"
import { TestTrigger, insertTriggers } from "../utils/manageTriggers"

jest.mock("services/queries/courtCasesByOrganisationUnitQuery")
jest.mock("services/queries/leftJoinAndSelectTriggersQuery")

jest.setTimeout(100000)
describe("filterListCourtCases", () => {
  let dataSource: DataSource
  const orgCode = "36FPA1"

  const exceptionHandlerUser = {
    username: "exceptionHandler",
    visibleForces: [orgCode],
    visibleCourts: [],
    hasAccessTo: exceptionHandlerHasAccessTo
  } as Partial<User> as User

  const triggerHandlerUser = {
    visibleForces: [orgCode],
    visibleCourts: [],
    hasAccessTo: triggerHandlerHasAccessTo
  } as Partial<User> as User

  // const generalHandlerUser = {
  //   username: "generalHandler",
  //   visibleForces: [orgCode],
  //   visibleCourts: [],
  //   hasAccessTo: generalHandlerHasAccessTo
  // } as Partial<User> as User

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
    // const dummyTriggerCode = "TRPR0001"
    // const bailsTriggerCode = "TRPR0010"
    const getTrigger = (triggerCode: string, status: ResolutionStatus): TestTrigger => {
      return {
        triggerCode: triggerCode,
        status: status,
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      } as TestTrigger
    }

    const insertTestCaseWithTriggersAndExceptions = async (args: {
      caseId: number
      triggerResolvedBy?: string
      exceptionResolvedBy?: string
      triggerCode?: string
    }) => {
      await insertCourtCasesWithFields([
        {
          errorId: args.caseId,
          defendantName: `${
            args.exceptionResolvedBy ? `Exceptions Resolved by ${args.exceptionResolvedBy}` : "Exceptions Unresolved"
          }/${args.triggerResolvedBy ? `Triggers Resolved by ${args.triggerResolvedBy}` : "Triggers Unresolved"}`,
          orgForPoliceFilter: orgCode,
          triggerResolvedBy: args.triggerResolvedBy,
          triggerResolvedTimestamp: args.triggerResolvedBy ? new Date() : null,
          triggerStatus: args.triggerResolvedBy ? "Resolved" : "Unresolved"
        }
      ])
      if (args.triggerCode) {
        await insertTriggers(args.caseId, [
          getTrigger(args.triggerCode, args.triggerResolvedBy ? "Resolved" : "Unresolved")
        ])
      }
      await insertException(
        args.caseId,
        "HO100300",
        "HO100300",
        args.exceptionResolvedBy ? "Resolved" : "Unresolved",
        args.exceptionResolvedBy
      )
    }

    beforeEach(async () => {
      await insertCourtCasesWithFields([
        // {
        //   errorId: 3,
        //   defendantName: "Everything Resolved - generalHandler triggers",
        //   orgForPoliceFilter: orgCode,
        //   triggerResolvedBy: "generalHandler",
        //   triggerResolvedTimestamp: new Date(),
        //   triggerStatus: "Resolved",
        //   errorResolvedBy: "Dummy user",
        //   errorResolvedTimestamp: new Date(),
        //   errorStatus: "Resolved",
        //   resolutionTimestamp: new Date()
        // },
        // {
        //   errorId: 4,
        //   defendantName: "Everything Resolved - generalHandler errors",
        //   orgForPoliceFilter: orgCode,
        //   triggerResolvedBy: "Dummy user",
        //   triggerResolvedTimestamp: new Date(),
        //   triggerStatus: "Resolved",
        //   errorResolvedBy: "generalHandler",
        //   errorResolvedTimestamp: new Date(),
        //   errorStatus: "Resolved",
        //   resolutionTimestamp: new Date()
        // },
        // {
        //   errorId: 5,
        //   defendantName: "Everything Resolved - generalHandler both",
        //   orgForPoliceFilter: orgCode,
        //   triggerResolvedBy: "generalHandler",
        //   triggerResolvedTimestamp: new Date(),
        //   triggerStatus: "Resolved",
        //   errorResolvedBy: "generalHandler",
        //   errorResolvedTimestamp: new Date(),
        //   errorStatus: "Resolved",
        //   resolutionTimestamp: new Date()
        // },
        // {
        //   errorId: 6,
        //   defendantName: "Exceptions Resolved by exceptionHandler/Triggers Resolved by other user",
        //   orgForPoliceFilter: orgCode,
        //   triggerResolvedBy: "Dummy user",
        //   triggerResolvedTimestamp: new Date(),
        //   triggerStatus: "Resolved",
        //   errorResolvedBy: "exceptionHandler",
        //   errorResolvedTimestamp: new Date(),
        //   errorStatus: "Resolved",
        //   resolutionTimestamp: new Date()
        // },
        // { errorId: 7, defendantName: "Everything Unresolved", orgForPoliceFilter: orgCode },
        // {
        //   errorId: 8,
        //   defendantName: "Bails Resolved/No Exceptions",
        //   orgForPoliceFilter: orgCode,
        //   triggerResolvedBy: "Dummy user",
        //   triggerResolvedTimestamp : new Date(),
        //   resolutionTimestamp: new Date(),
        //   triggerStatus: "Resolved"
        // },
        // { errorId: 9, defendantName: "Bails Unresolved/No Exceptions", orgForPoliceFilter: orgCode }
      ])

      await insertTestCaseWithTriggersAndExceptions({
        caseId: 0,
        triggerResolvedBy: "Dummy user",
        exceptionResolvedBy: undefined
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 1,
        triggerResolvedBy: undefined,
        exceptionResolvedBy: exceptionHandlerUser.username
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 2,
        triggerResolvedBy: triggerHandlerUser.username,
        exceptionResolvedBy: exceptionHandlerUser.username
      })

      // await insertTriggers(0, [getTrigger(dummyTriggerCode, "Resolved")])
      // await insertException(0, "HO100300", undefined, "Unresolved")

      // await insertTriggers(1, [getTrigger(dummyTriggerCode, "Unresolved")])
      // await insertException(1, "HO100300", undefined, "Resolved", "exceptionHandler")

      // await insertTriggers(2, [getTrigger(dummyTriggerCode, "Resolved")])
      // await insertException(2, "HO100300", undefined, "Resolved", "exceptionHandler")

      // await insertTriggers(3, [getTrigger(dummyTriggerCode, "Resolved")], "generalHandler")
      // await insertException(3, "HO100300", undefined, "Resolved")

      // await insertTriggers(4, [getTrigger(dummyTriggerCode, "Resolved")])
      // await insertException(4, "HO100300", undefined, "Resolved", "generalHandler")

      // await insertTriggers(5, [getTrigger(dummyTriggerCode, "Resolved")], "generalHandler")
      // await insertException(5, "HO100300", undefined, "Resolved", "generalHandler")

      // await insertTriggers(6, [getTrigger(dummyTriggerCode, "Resolved")])
      // await insertException(6, "HO100300", undefined, "Resolved", "exceptionHandler")

      // await insertTriggers(7, [getTrigger(dummyTriggerCode, "Unresolved")])
      // await insertException(7, "HO100300", undefined, "Unresolved")

      // await insertTriggers(8, [getTrigger(bailsTriggerCode, "Resolved")])
      // await insertTriggers(9, [getTrigger(bailsTriggerCode, "Unresolved")])
    })

    const testCases: { description: string; caseState: CaseState; user: User; expectedCases: string[] }[] = [
      {
        description:
          "Should see cases with unresolved exceptions when user is an exception handler and unresolved filter applied",
        caseState: "Unresolved",
        user: exceptionHandlerUser,
        expectedCases: ["Exceptions Unresolved/Triggers Resolved by Dummy user", "Everything Unresolved"]
      },
      {
        description:
          "Should see cases with resolved exceptions when user is an exception handler and resolved filter applied",
        caseState: "Resolved",
        user: exceptionHandlerUser,
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Triggers Unresolved",
          "Exceptions Resolved by exceptionHandler/Triggers Resolved by triggerHandler",
          "Exceptions Resolved by exceptionHandler/Triggers Resolved by other user"
        ]
      }
      // {
      //   description:
      //     "Should see cases with unresolved triggers when user is a trigger handler and unresolved filter applied",
      //   caseState: "Unresolved",
      //   user: triggerHandlerUser,
      //   expectedCases: [
      //     "Exceptions Resolved/Triggers Unresolved",
      //     "Everything Unresolved",
      //     "Bails Unresolved/No Exceptions"
      //   ]
      // },
      // {
      //   description:
      //     "Should see cases with resolved triggers when user is a trigger handler and resolved filter applied",
      //   caseState: "Resolved",
      //   user: triggerHandlerUser,
      //   expectedCases: [
      //     "Triggers Resolved/Exceptions Unresolved",
      //     "Exceptions Resolved by exceptionHandler/Triggers Resolved by triggerHandler",
      //     "Bails Resolved/No Exceptions"
      //   ]
      // },
      // {
      //   description:
      //     "Should see cases with resolved triggers and exceptions when user is a general handler and resolved filter applied",
      //   caseState: "Resolved",
      //   user: generalHandlerUser,
      //   expectedCases: [
      //     "Everything Resolved - generalHandler triggers",
      //     "Everything Resolved - generalHandler errors",
      //     "Everything Resolved - generalHandler both"
      //   ]
      // }
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

      console.log(cases)

      expect(cases).toHaveLength(expectedCases.length)

      for (let i = 0; i < expectedCases.length; i++) {
        expect(cases[i].defendantName).toBe(expectedCases[i])
      }
    })
  })
})

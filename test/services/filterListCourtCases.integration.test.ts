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
  generalHandlerHasAccessTo,
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
  const anotherUserName = "someoneElse"

  const exceptionHandler = {
    username: "exceptionHandler",
    visibleForces: [orgCode],
    visibleCourts: [],
    hasAccessTo: exceptionHandlerHasAccessTo
  } as Partial<User> as User

  const triggerHandler = {
    username: "triggerHandler",
    visibleForces: [orgCode],
    visibleCourts: [],
    hasAccessTo: triggerHandlerHasAccessTo
  } as Partial<User> as User

  const generalHandler = {
    username: "generalHandler",
    visibleForces: [orgCode],
    visibleCourts: [],
    hasAccessTo: generalHandlerHasAccessTo
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

    const insertTestCaseWithTriggersAndExceptions = async (args: {
      caseId: number
      trigger?: {
        triggerResolvedBy?: string
        bailsTrigger?: boolean
      }
      exception?: {
        exceptionResolvedBy?: string
      }
    }) => {
      const triggerOrBailsTrigger = `${args.trigger?.bailsTrigger ? "Bails Trigger" : "Trigger"}`

      await insertCourtCasesWithFields([
        {
          errorId: args.caseId,
          defendantName: `${
            args.exception?.exceptionResolvedBy
              ? `Exceptions Resolved by ${args.exception.exceptionResolvedBy}`
              : `${args.exception ? "Exceptions Unresolved" : "No exceptions"}`
          }/${
            args.trigger?.triggerResolvedBy
              ? `${triggerOrBailsTrigger} Resolved by ${args.trigger.triggerResolvedBy}`
              : `${triggerOrBailsTrigger} Unresolved`
          }`,
          errorCount: args.exception ? 1 : 0,
          orgForPoliceFilter: orgCode,
          triggerResolvedBy: args.trigger?.triggerResolvedBy,
          triggerResolvedTimestamp: args.trigger?.triggerResolvedBy ? new Date() : null,
          triggerStatus: args.trigger?.triggerResolvedBy ? "Resolved" : "Unresolved",
          resolutionTimestamp:
            (args.trigger?.triggerResolvedBy && args.exception?.exceptionResolvedBy) ||
            (args.trigger?.triggerResolvedBy && !args.exception) ||
            (args.exception?.exceptionResolvedBy && !args.trigger)
              ? new Date()
              : undefined
        }
      ])
      if (args.trigger) {
        await insertTriggers(
          args.caseId,
          [
            getTrigger(
              args.trigger.bailsTrigger ? bailsTriggerCode : dummyTriggerCode,
              args.trigger.triggerResolvedBy ? "Resolved" : "Unresolved"
            )
          ],
          args.trigger.triggerResolvedBy
        )
      }
      if (args.exception) {
        await insertException(
          args.caseId,
          "HO100300",
          "HO100300",
          args.exception.exceptionResolvedBy ? "Resolved" : "Unresolved",
          args.exception.exceptionResolvedBy
        )
      }
    }

    beforeEach(async () => {
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 0,
        trigger: {
          triggerResolvedBy: anotherUserName
        },
        exception: {
          exceptionResolvedBy: undefined
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 1,
        trigger: {
          triggerResolvedBy: undefined
        },
        exception: {
          exceptionResolvedBy: exceptionHandler.username
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 2,
        trigger: {
          triggerResolvedBy: triggerHandler.username
        },
        exception: {
          exceptionResolvedBy: exceptionHandler.username
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 3,
        trigger: {
          triggerResolvedBy: generalHandler.username
        },
        exception: {
          exceptionResolvedBy: anotherUserName
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 4,
        trigger: {
          triggerResolvedBy: anotherUserName
        },
        exception: {
          exceptionResolvedBy: generalHandler.username
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 5,
        trigger: {
          triggerResolvedBy: generalHandler.username
        },
        exception: {
          exceptionResolvedBy: generalHandler.username
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 6,
        trigger: {
          triggerResolvedBy: undefined
        },
        exception: {
          exceptionResolvedBy: undefined
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 7,
        trigger: {
          triggerResolvedBy: anotherUserName,
          bailsTrigger: true
        },
        exception: undefined
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 8,
        trigger: {
          triggerResolvedBy: triggerHandler.username,
          bailsTrigger: true
        },
        exception: undefined
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 9,
        trigger: {
          triggerResolvedBy: undefined,
          bailsTrigger: true
        },
        exception: undefined
      })
    })

    const testCases: { description: string; caseState: CaseState; user: User; expectedCases: string[] }[] = [
      {
        description:
          "Should see cases with unresolved exceptions when user is an exception handler and unresolved filter applied",
        caseState: "Unresolved",
        user: exceptionHandler,
        expectedCases: [
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Unresolved/Trigger Unresolved"
        ]
      },
      {
        description:
          "Should see cases with resolved exceptions when user is an exception handler and resolved filter applied",
        caseState: "Resolved",
        user: exceptionHandler,
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler"
        ]
      },
      {
        description:
          "Should see cases with unresolved triggers when user is a trigger handler and unresolved filter applied",
        caseState: "Unresolved",
        user: triggerHandler,
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved"
        ]
      },
      {
        description:
          "Should see cases with resolved triggers when user is a trigger handler and resolved filter applied",
        caseState: "Resolved",
        user: triggerHandler,
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler",
          "No exceptions/Bails Trigger Resolved by triggerHandler"
        ]
      },
      {
        description:
          "Should see cases with unresolved triggers or unresolved exceptions when user is a general handler and unresolved filter applied",
        caseState: "Unresolved",
        user: generalHandler,
        expectedCases: [
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved"
        ]
      },
      {
        description:
          "Should see cases with resolved triggers and exceptions when user is a general handler and resolved filter applied",
        caseState: "Resolved",
        user: generalHandler,
        expectedCases: [
          "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler",
          "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
          "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler"
        ]
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

      console.log(cases.map((c) => c.defendantName))

      expect(cases).toHaveLength(expectedCases.length)

      cases
        .map((c) => c.defendantName)
        .forEach((defendantName) => {
          expect(expectedCases).toContain(defendantName)
        })
    })
  })
})

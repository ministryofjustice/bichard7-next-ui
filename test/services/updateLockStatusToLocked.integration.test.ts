import type { AuditLogEvent } from "@moj-bichard7-developers/bichard7-next-core/common/types/AuditLogEvent"
import User from "services/entities/User"
import { DataSource } from "typeorm"
import { userAccess } from "utils/userPermissions"
import { AUDIT_LOG_EVENT_SOURCE } from "../../src/config"
import CourtCase from "../../src/services/entities/CourtCase"
import getCourtCase from "../../src/services/getCourtCase"
import getDataSource from "../../src/services/getDataSource"
import updateLockStatusToLocked from "../../src/services/updateLockStatusToLocked"
import { ResolutionStatus } from "../../src/types/ResolutionStatus"
import { isError } from "../../src/types/Result"
import { UserGroup } from "../../src/types/UserGroup"
import deleteFromEntity from "../utils/deleteFromEntity"
import { getDummyCourtCase, insertCourtCases } from "../utils/insertCourtCases"

describe("Update lock status to locked", () => {
  let dataSource: DataSource

  const exceptionLockedEvent = (username = "current user") => ({
    category: "information",
    eventSource: AUDIT_LOG_EVENT_SOURCE,
    eventType: "Exception locked",
    eventCode: "exceptions.locked",
    timestamp: expect.anything(),
    attributes: {
      user: username,
      auditLogVersion: 2
    }
  })
  const triggerLockedEvent = (username = "current user") => ({
    category: "information",
    eventSource: AUDIT_LOG_EVENT_SOURCE,
    eventType: "Trigger locked",
    eventCode: "triggers.locked",
    timestamp: expect.anything(),
    attributes: {
      user: username,
      auditLogVersion: 2
    }
  })

  const testCases = [
    {
      description: "General handler can lock a case that is not locked",
      triggerLockedBy: null,
      exceptionLockedBy: null,
      currentUserGroup: UserGroup.GeneralHandler,
      expectTriggersToBeLockedBy: "current user",
      expectExceptionsToBeLockedBy: "current user",
      expectedEvents: [exceptionLockedEvent(), triggerLockedEvent()]
    },
    {
      description: "General handler can lock the exception when the trigger is already locked ",
      triggerLockedBy: "another user",
      exceptionLockedBy: null,
      currentUserGroup: UserGroup.GeneralHandler,
      expectTriggersToBeLockedBy: "another user",
      expectExceptionsToBeLockedBy: "current user",
      expectedEvents: [exceptionLockedEvent()]
    },
    {
      description: "General handler can lock the exception when the trigger status is submitted ",
      triggerLockedBy: null,
      exceptionLockedBy: null,
      currentUserGroup: UserGroup.GeneralHandler,
      expectTriggersToBeLockedBy: null,
      expectExceptionsToBeLockedBy: "current user",
      triggerStatus: "Submitted" as ResolutionStatus,
      expectedEvents: [exceptionLockedEvent()]
    },
    {
      description: "General handler can lock the trigger when the exception is already locked ",
      triggerLockedBy: null,
      exceptionLockedBy: "another user",
      currentUserGroup: UserGroup.GeneralHandler,
      expectTriggersToBeLockedBy: "current user",
      expectExceptionsToBeLockedBy: "another user",
      expectedEvents: [triggerLockedEvent()]
    },
    {
      description: "General handler can lock the trigger when the error status is submitted",
      triggerLockedBy: null,
      exceptionLockedBy: null,
      currentUserGroup: UserGroup.GeneralHandler,
      expectTriggersToBeLockedBy: "current user",
      errorStatus: "Submitted" as ResolutionStatus,
      expectExceptionsToBeLockedBy: null,
      expectedEvents: [triggerLockedEvent()]
    },
    {
      description: "General handler cannot lock a case that is already locked",
      triggerLockedBy: "another user",
      exceptionLockedBy: "another user",
      currentUserGroup: UserGroup.GeneralHandler,
      expectTriggersToBeLockedBy: "another user",
      expectExceptionsToBeLockedBy: "another user",
      expectedEvents: []
    },
    {
      description: "General handler cannot lock a case when the error status and trigger status is submitted",
      triggerLockedBy: null,
      exceptionLockedBy: null,
      currentUserGroup: UserGroup.GeneralHandler,
      expectTriggersToBeLockedBy: null,
      expectExceptionsToBeLockedBy: null,
      errorStatus: "Submitted" as ResolutionStatus,
      triggerStatus: "Submitted" as ResolutionStatus,
      expectedEvents: []
    },
    {
      description: "Trigger handler can lock the trigger when the exception is already locked ",
      triggerLockedBy: null,
      exceptionLockedBy: "another user",
      currentUserGroup: UserGroup.TriggerHandler,
      expectTriggersToBeLockedBy: "current user",
      expectExceptionsToBeLockedBy: "another user",
      expectedEvents: [triggerLockedEvent()]
    },
    {
      description: "Trigger handler can lock the trigger when the exception is not locked ",
      triggerLockedBy: null,
      exceptionLockedBy: null,
      currentUserGroup: UserGroup.TriggerHandler,
      expectTriggersToBeLockedBy: "current user",
      expectExceptionsToBeLockedBy: null,
      expectedEvents: [triggerLockedEvent()]
    },
    {
      description: "Trigger handler cannot lock a case that is already locked",
      triggerLockedBy: "another user",
      exceptionLockedBy: null,
      currentUserGroup: UserGroup.TriggerHandler,
      expectTriggersToBeLockedBy: "another user",
      expectExceptionsToBeLockedBy: null,
      expectedEvents: []
    },
    {
      description: "Trigger handler cannot lock a case when the trigger status is submitted",
      triggerLockedBy: null,
      exceptionLockedBy: null,
      currentUserGroup: UserGroup.TriggerHandler,
      expectTriggersToBeLockedBy: null,
      expectExceptionsToBeLockedBy: null,
      triggerStatus: "Submitted" as ResolutionStatus,
      expectedEvents: []
    },
    {
      description: "Exception handler can lock the exception when the trigger is already locked ",
      triggerLockedBy: "another user",
      exceptionLockedBy: null,
      currentUserGroup: UserGroup.ExceptionHandler,
      expectTriggersToBeLockedBy: "another user",
      expectExceptionsToBeLockedBy: "current user",
      expectedEvents: [exceptionLockedEvent()]
    },
    {
      description: "Exception handler can lock the trigger when the exception is not locked ",
      triggerLockedBy: null,
      exceptionLockedBy: null,
      currentUserGroup: UserGroup.ExceptionHandler,
      expectTriggersToBeLockedBy: null,
      expectExceptionsToBeLockedBy: "current user",
      expectedEvents: [exceptionLockedEvent()]
    },
    {
      description: "Exception handler cannot lock a case that is already locked",
      triggerLockedBy: null,
      exceptionLockedBy: "another user",
      currentUserGroup: UserGroup.ExceptionHandler,
      expectTriggersToBeLockedBy: null,
      expectExceptionsToBeLockedBy: "another user",
      expectedEvents: []
    },
    {
      description: "Exception handler cannot lock a case when the error status is submitted",
      triggerLockedBy: null,
      exceptionLockedBy: null,
      currentUserGroup: UserGroup.ExceptionHandler,
      expectTriggersToBeLockedBy: null,
      expectExceptionsToBeLockedBy: null,
      errorStatus: "Submitted" as ResolutionStatus,
      expectedEvents: []
    },
    {
      description: "Auditor cannot lock a case",
      triggerLockedBy: null,
      exceptionLockedBy: null,
      currentUserGroup: UserGroup.Audit,
      expectTriggersToBeLockedBy: null,
      expectExceptionsToBeLockedBy: null,
      expectError: "update requires a lock (exception or trigger) to update",
      expectedEvents: []
    }
  ]

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

  test.each(testCases)(
    "$description",
    async ({
      triggerLockedBy,
      exceptionLockedBy,
      currentUserGroup,
      errorStatus,
      triggerStatus,
      expectTriggersToBeLockedBy,
      expectExceptionsToBeLockedBy,
      expectError,
      expectedEvents
    }) => {
      const inputCourtCase = await getDummyCourtCase({
        errorLockedByUsername: exceptionLockedBy,
        triggerLockedByUsername: triggerLockedBy,
        errorCount: 1,
        errorStatus: errorStatus ?? "Unresolved",
        triggerCount: 1,
        triggerStatus: triggerStatus ?? "Unresolved"
      })
      await insertCourtCases(inputCourtCase)

      const user = {
        username: "current user",
        visibleForces: [36],
        visibleCourts: [],
        hasAccessTo: userAccess({ groups: [currentUserGroup] })
      } as Partial<User> as User

      const events: AuditLogEvent[] = []
      const result = await updateLockStatusToLocked(dataSource.manager, inputCourtCase.errorId, user, events)

      if (expectError) {
        expect(isError(result)).toBe(true)
        expect((result as Error).message).toEqual(expectError)
      } else {
        expect(isError(result)).toBe(false)
      }

      const expectedCourtCase = await getDummyCourtCase({
        errorLockedByUsername: expectExceptionsToBeLockedBy,
        triggerLockedByUsername: expectTriggersToBeLockedBy,
        errorCount: 1,
        errorStatus: errorStatus ?? "Unresolved",
        triggerCount: 1,
        triggerStatus: triggerStatus ?? "Unresolved"
      })

      const actualCourtCase = await getCourtCase(dataSource, inputCourtCase.errorId)
      expect(actualCourtCase).toMatchObject(expectedCourtCase)
      expect(events).toStrictEqual(expectedEvents)
    }
  )
})

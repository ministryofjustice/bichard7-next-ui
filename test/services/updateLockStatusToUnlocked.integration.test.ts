import User from "services/entities/User"
import { DataSource, UpdateQueryBuilder } from "typeorm"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import updateLockStatusToUnlocked from "../../src/services/updateLockStatusToUnlocked"
import { isError } from "../../src/types/Result"
import deleteFromEntity from "../utils/deleteFromEntity"
import { getDummyCourtCase, insertCourtCases, insertCourtCasesWithFields } from "../utils/insertCourtCases"
import type AuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AuditLogEvent"
import UnlockReason from "types/UnlockReason"
import { hasAccessToTriggers, hasAccessToExceptions, isSupervisor } from "utils/userPermissions"
import { AUDIT_LOG_EVENT_SOURCE } from "../../src/config"

jest.mock("utils/userPermissions")

describe("lock court case", () => {
  let dataSource: DataSource

  const exceptionUnlockedEvent = (username = "some user") => ({
    category: "information",
    eventSource: AUDIT_LOG_EVENT_SOURCE,
    eventType: "Exception unlocked",
    timestamp: expect.anything(),
    attributes: {
      user: username,
      auditLogVersion: 2,
      eventCode: "exceptions.unlocked"
    }
  })
  const triggerUnlockedEvent = (username = "some user") => ({
    category: "information",
    eventSource: AUDIT_LOG_EVENT_SOURCE,
    eventType: "Trigger unlocked",
    timestamp: expect.anything(),
    attributes: {
      user: username,
      auditLogVersion: 2,
      eventCode: "triggers.unlocked"
    }
  })

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
    ;(hasAccessToExceptions as jest.Mock).mockReturnValue(true)
    ;(hasAccessToTriggers as jest.Mock).mockReturnValue(true)
    ;(isSupervisor as jest.Mock).mockReturnValue(false)
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  describe("when user has permission to unlock a case", () => {
    it("Should unlock a locked court case", async () => {
      const lockedByName = "some user"
      const lockedCourtCase = {
        errorLockedByUsername: lockedByName,
        triggerLockedByUsername: lockedByName,
        orgForPoliceFilter: "36FPA ",
        errorId: 1
      }

      const anotherLockedCourtCase = {
        errorLockedByUsername: lockedByName,
        triggerLockedByUsername: lockedByName,
        orgForPoliceFilter: "36FPA ",
        errorId: 2
      }
      await insertCourtCasesWithFields([lockedCourtCase, anotherLockedCourtCase])

      const user = {
        username: lockedByName,
        visibleForces: ["36FPA1"],
        visibleCourts: []
      } as Partial<User> as User

      const events: AuditLogEvent[] = []
      const result = await updateLockStatusToUnlocked(
        dataSource.manager,
        1,
        user,
        UnlockReason.TriggerAndException,
        events
      )
      expect(isError(result)).toBe(false)

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: 1 } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.errorLockedByUsername).toBeNull()
      expect(actualCourtCase.triggerLockedByUsername).toBeNull()

      const anotherRecord = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: 2 } })
      const anotherCourtCase = anotherRecord as CourtCase
      expect(anotherCourtCase.errorLockedByUsername).toEqual(lockedByName)
      expect(anotherCourtCase.triggerLockedByUsername).toEqual(lockedByName)
      expect(events).toStrictEqual([exceptionUnlockedEvent(), triggerUnlockedEvent()])
    })

    it("Should only unlock exceptions when user is exception handler", async () => {
      const lockedByName = "some user"
      const lockedCourtCase = await getDummyCourtCase({
        errorLockedByUsername: lockedByName,
        triggerLockedByUsername: lockedByName,
        orgForPoliceFilter: "36FPA "
      })
      await insertCourtCases(lockedCourtCase)
      ;(hasAccessToTriggers as jest.Mock).mockReturnValue(false)

      const user = {
        username: lockedByName,
        visibleForces: ["36FPA1"],
        visibleCourts: []
      } as Partial<User> as User

      const events: AuditLogEvent[] = []
      const result = await updateLockStatusToUnlocked(
        dataSource.manager,
        lockedCourtCase.errorId,
        user,
        UnlockReason.TriggerAndException,
        events
      )
      expect(isError(result)).toBe(false)

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: lockedCourtCase.errorId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.errorLockedByUsername).toBeNull()
      expect(actualCourtCase.triggerLockedByUsername).toBe(lockedByName)
      expect(events).toStrictEqual([exceptionUnlockedEvent()])
    })

    it("Should only unlock triggers when user is trigger handler", async () => {
      const lockedByName = "some user"
      const lockedCourtCase = await getDummyCourtCase({
        errorLockedByUsername: lockedByName,
        triggerLockedByUsername: lockedByName,
        orgForPoliceFilter: "36FPA "
      })
      await insertCourtCases(lockedCourtCase)
      ;(hasAccessToExceptions as jest.Mock).mockReturnValue(false)

      const user = {
        username: lockedByName,
        visibleForces: ["36FPA1"],
        visibleCourts: []
      } as Partial<User> as User

      const events: AuditLogEvent[] = []
      const result = await updateLockStatusToUnlocked(
        dataSource.manager,
        lockedCourtCase.errorId,
        user,
        UnlockReason.TriggerAndException,
        events
      )
      expect(isError(result)).toBe(false)

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: lockedCourtCase.errorId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.errorLockedByUsername).toBe(lockedByName)
      expect(actualCourtCase.triggerLockedByUsername).toBeNull()
      expect(events).toStrictEqual([triggerUnlockedEvent()])
    })

    it("Should unlock exception only when 'reasonToUnlock' specified", async () => {
      const lockedByName = "some user"
      const lockedCourtCase = await getDummyCourtCase({
        errorLockedByUsername: lockedByName,
        triggerLockedByUsername: lockedByName,
        orgForPoliceFilter: "36FPA "
      })
      await insertCourtCases(lockedCourtCase)

      const user = {
        username: lockedByName,
        visibleForces: ["36FPA1"],
        visibleCourts: []
      } as Partial<User> as User

      const events: AuditLogEvent[] = []
      const result = await updateLockStatusToUnlocked(
        dataSource.manager,
        lockedCourtCase.errorId,
        user,
        UnlockReason.Exception,
        events
      )
      expect(isError(result)).toBe(false)

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: lockedCourtCase.errorId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.errorLockedByUsername).toBeNull()
      expect(actualCourtCase.triggerLockedByUsername).toBe(lockedByName)
      expect(events).toStrictEqual([exceptionUnlockedEvent()])
    })

    it("Should unlock trigger only when 'reasonToUnlock' specified", async () => {
      const lockedByName = "some user"
      const lockedCourtCase = await getDummyCourtCase({
        errorLockedByUsername: lockedByName,
        triggerLockedByUsername: lockedByName,
        orgForPoliceFilter: "36FPA "
      })
      await insertCourtCases(lockedCourtCase)

      const user = {
        username: lockedByName,
        visibleForces: ["36FPA1"],
        visibleCourts: []
      } as Partial<User> as User

      const events: AuditLogEvent[] = []
      const result = await updateLockStatusToUnlocked(
        dataSource.manager,
        lockedCourtCase.errorId,
        user,
        UnlockReason.Trigger,
        events
      )
      expect(isError(result)).toBe(false)

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: lockedCourtCase.errorId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.triggerLockedByUsername).toBeNull()
      expect(actualCourtCase.errorLockedByUsername).toBe(lockedByName)
      expect(events).toStrictEqual([triggerUnlockedEvent()])
    })

    it("can unlock trigger when exception is not locked", async () => {
      const lockedByName = "some user"
      const lockedCourtCase = await getDummyCourtCase({
        triggerLockedByUsername: lockedByName,
        orgForPoliceFilter: "36FPA "
      })
      await insertCourtCases(lockedCourtCase)

      const user = {
        username: lockedByName,
        visibleForces: ["36FPA1"],
        visibleCourts: []
      } as Partial<User> as User

      const events: AuditLogEvent[] = []
      const result = await updateLockStatusToUnlocked(
        dataSource.manager,
        lockedCourtCase.errorId,
        user,
        UnlockReason.Trigger,
        events
      )
      expect(isError(result)).toBe(false)

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: lockedCourtCase.errorId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.triggerLockedByUsername).toBeNull()
      expect(actualCourtCase.errorLockedByUsername).toBeNull()
      expect(events).toStrictEqual([triggerUnlockedEvent()])
    })

    it("can unlock exception when trigger is not locked", async () => {
      const lockedByName = "some user"
      const lockedCourtCase = await getDummyCourtCase({
        errorLockedByUsername: lockedByName,
        orgForPoliceFilter: "36FPA "
      })
      await insertCourtCases(lockedCourtCase)

      const user = {
        username: lockedByName,
        visibleForces: ["36FPA1"],
        visibleCourts: []
      } as Partial<User> as User

      const events: AuditLogEvent[] = []
      const result = await updateLockStatusToUnlocked(
        dataSource.manager,
        lockedCourtCase.errorId,
        user,
        UnlockReason.Exception,
        events
      )
      expect(isError(result)).toBe(false)

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: lockedCourtCase.errorId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.triggerLockedByUsername).toBeNull()
      expect(actualCourtCase.errorLockedByUsername).toBeNull()
      expect(events).toStrictEqual([exceptionUnlockedEvent()])
    })
  })

  describe("when user doesn't have permission to unlock a case", () => {
    it("can handle missing permission gracefully", async () => {
      const dummyErrorId = 0
      const user = {
        username: "Dummy username"
      } as Partial<User> as User
      ;(hasAccessToExceptions as jest.Mock).mockReturnValue(false)
      ;(hasAccessToTriggers as jest.Mock).mockReturnValue(false)

      const events: AuditLogEvent[] = []
      const result = await updateLockStatusToUnlocked(
        dataSource.manager,
        dummyErrorId,
        user,
        UnlockReason.TriggerAndException,
        events
      )
      expect(isError(result)).toBe(true)

      const receivedError = result as Error

      expect(receivedError.message).toEqual("User hasn't got permission to unlock the case")
      expect(events).toHaveLength(0)
    })

    it("can handle missing permission gracefully when unlocking triggers", async () => {
      const dummyErrorId = 0
      const user = {
        username: "Dummy username"
      } as Partial<User> as User
      ;(hasAccessToTriggers as jest.Mock).mockReturnValue(false)

      const events: AuditLogEvent[] = []
      const result = await updateLockStatusToUnlocked(
        dataSource.manager,
        dummyErrorId,
        user,
        UnlockReason.Trigger,
        events
      )
      expect(isError(result)).toBe(true)

      const receivedError = result as Error

      expect(receivedError.message).toEqual("User hasn't got permission to unlock the case")
      expect(events).toHaveLength(0)
    })

    it("can handle missing permission gracefully when unlocking exceptions", async () => {
      const dummyErrorId = 0
      const user = {
        username: "Dummy username"
      } as Partial<User> as User
      ;(hasAccessToExceptions as jest.Mock).mockReturnValue(false)

      const events: AuditLogEvent[] = []
      const result = await updateLockStatusToUnlocked(
        dataSource.manager,
        dummyErrorId,
        user,
        UnlockReason.Exception,
        events
      )
      expect(isError(result)).toBe(true)

      const receivedError = result as Error

      expect(receivedError.message).toEqual("User hasn't got permission to unlock the case")
      expect(events).toHaveLength(0)
    })

    it("is does not update the lock when the case locked by another user", async () => {
      const lockedByName = "another user"
      const lockedCourtCase = await getDummyCourtCase({
        errorLockedByUsername: lockedByName,
        triggerLockedByUsername: lockedByName,
        orgForPoliceFilter: "36FPA "
      })
      await insertCourtCases(lockedCourtCase)

      const user = {
        username: "User with different name",
        visibleForces: ["36FPA1"],
        visibleCourts: []
      } as Partial<User> as User

      const events: AuditLogEvent[] = []
      const result = await updateLockStatusToUnlocked(
        dataSource.manager,
        lockedCourtCase.errorId,
        user,
        UnlockReason.TriggerAndException,
        events
      )
      expect(isError(result)).toBe(false)

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: lockedCourtCase.errorId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.errorLockedByUsername).toEqual(lockedByName)
      expect(actualCourtCase.triggerLockedByUsername).toEqual(lockedByName)
      expect(events).toHaveLength(0)
    })
  })

  describe("when user is a supervisor", () => {
    it("can unlock a case that is locked by another user", async () => {
      const lockedByName = "another user"
      const lockedCourtCase = await getDummyCourtCase({
        errorLockedByUsername: lockedByName,
        triggerLockedByUsername: lockedByName,
        orgForPoliceFilter: "36FPA "
      })
      await insertCourtCases(lockedCourtCase)

      const user = {
        username: "Sup User",
        visibleForces: ["36FPA1"],
        visibleCourts: []
      } as Partial<User> as User
      ;(isSupervisor as jest.Mock).mockReturnValue(true)

      const events: AuditLogEvent[] = []
      const result = await updateLockStatusToUnlocked(
        dataSource.manager,
        lockedCourtCase.errorId,
        user,
        UnlockReason.TriggerAndException,
        events
      )
      expect(isError(result)).toBe(false)

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: lockedCourtCase.errorId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.errorLockedByUsername).toBeNull()
      expect(actualCourtCase.triggerLockedByUsername).toBeNull()
      expect(events).toStrictEqual([exceptionUnlockedEvent(user.username), triggerUnlockedEvent(user.username)])
    })

    it("cannot unlock a case that is not visible for them", async () => {
      const lockedByName = "another user"
      const lockedCourtCase = await getDummyCourtCase({
        errorLockedByUsername: lockedByName,
        triggerLockedByUsername: lockedByName,
        orgForPoliceFilter: "36FPA1"
      })
      await insertCourtCases(lockedCourtCase)

      const user = {
        username: "Sup User",
        visibleForces: ["13GH"],
        visibleCourts: []
      } as Partial<User> as User
      ;(isSupervisor as jest.Mock).mockReturnValue(true)

      const events: AuditLogEvent[] = []
      const result = await updateLockStatusToUnlocked(
        dataSource.manager,
        lockedCourtCase.errorId,
        user,
        UnlockReason.TriggerAndException,
        events
      )
      expect(isError(result)).toBe(false)

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: lockedCourtCase.errorId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.errorLockedByUsername).toEqual(lockedByName)
      expect(actualCourtCase.triggerLockedByUsername).toEqual(lockedByName)
      expect(events).toHaveLength(0)
    })
  })

  describe("when there is an error", () => {
    it("Should return the error when failed to unlock court case", async () => {
      jest
        .spyOn(UpdateQueryBuilder.prototype, "execute")
        .mockRejectedValue(Error("Failed to update record with some error"))

      const lockedCourtCase = await getDummyCourtCase({
        errorLockedByUsername: "dummy",
        triggerLockedByUsername: "dummy"
      })
      await insertCourtCases(lockedCourtCase)

      const user = {
        username: "dummy username",
        visibleForces: ["36FPA1"],
        visibleCourts: []
      } as Partial<User> as User
      ;(hasAccessToTriggers as jest.Mock).mockReturnValue(false)

      const events: AuditLogEvent[] = []
      const result = await updateLockStatusToUnlocked(
        dataSource.manager,
        lockedCourtCase.errorId,
        user,
        UnlockReason.TriggerAndException,
        events
      )
      expect(isError(result)).toBe(true)

      const receivedError = result as Error

      expect(receivedError.message).toEqual("Failed to update record with some error")
      expect(events).toHaveLength(0)
    })
  })
})

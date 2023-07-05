import User from "services/entities/User"
import { DataSource } from "typeorm"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import { isError } from "../../src/types/Result"
import deleteFromEntity from "../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"
import lockCourtCase from "services/lockCourtCase"
import { AUDIT_LOG_API_URL } from "../../src/config"
import deleteFromDynamoTable from "../utils/deleteFromDynamoTable"
import axios from "axios"
import updateLockStatusToLocked from "services/updateLockStatusToLocked"
import storeAuditLogEvents from "services/storeAuditLogEvents"
import { hasAccessToTriggers, hasAccessToExceptions } from "utils/userPermissions"

jest.mock("services/updateLockStatusToLocked")
jest.mock("services/storeAuditLogEvents")
jest.mock("utils/userPermissions")

describe("lock court case", () => {
  let dataSource: DataSource
  const lockedByName = "some user"
  const user = {
    username: lockedByName,
    visibleForces: ["36FPA1"],
    visibleCourts: []
  } as Partial<User> as User
  let unlockedCourtCase: CourtCase

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
    await deleteFromDynamoTable("auditLogTable", "messageId")
    await deleteFromDynamoTable("auditLogEventsTable", "_id")
    ;(updateLockStatusToLocked as jest.Mock).mockImplementation(
      jest.requireActual("services/updateLockStatusToLocked").default
    )
    ;(storeAuditLogEvents as jest.Mock).mockImplementation(jest.requireActual("services/storeAuditLogEvents").default)
    ;(hasAccessToExceptions as jest.Mock).mockReturnValue(true)
    ;(hasAccessToTriggers as jest.Mock).mockReturnValue(true)
    ;[unlockedCourtCase] = await insertCourtCasesWithFields([
      {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        errorCount: 1,
        triggerCount: 1,
        orgForPoliceFilter: "36FPA ",
        errorId: 0
      }
    ])
  })

  afterEach(async () => {
    jest.resetAllMocks()
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  describe("when a case is successfully locked", () => {
    it("Should call updateLockStatusToLocked and storeAuditLogEvents", async () => {
      const expectedAuditLogEvents = [
        {
          attributes: { auditLogVersion: 2, eventCode: "exceptions.locked", user: lockedByName },
          category: "information",
          eventSource: "Bichard New UI",
          eventType: "Exception locked",
          timestamp: expect.anything()
        },
        {
          attributes: { auditLogVersion: 2, eventCode: "triggers.locked", user: lockedByName },
          category: "information",
          eventSource: "Bichard New UI",
          eventType: "Trigger locked",
          timestamp: expect.anything()
        }
      ]

      const result = await lockCourtCase(dataSource, unlockedCourtCase.errorId, user).catch((error) => error)

      expect(isError(result)).toBeFalsy()
      expect(updateLockStatusToLocked).toHaveBeenCalledTimes(1)
      expect(updateLockStatusToLocked).toHaveBeenCalledWith(
        expect.any(Object),
        unlockedCourtCase.errorId,
        user,
        expectedAuditLogEvents
      )
      expect(storeAuditLogEvents).toHaveBeenCalledTimes(1)
      expect(storeAuditLogEvents).toHaveBeenCalledWith(unlockedCourtCase.messageId, expectedAuditLogEvents)
    })

    it("Should lock the case and update the audit log events", async () => {
      const result = await lockCourtCase(dataSource, unlockedCourtCase.errorId, user)
      expect(isError(result)).toBe(false)

      const record = await dataSource
        .getRepository(CourtCase)
        .findOne({ where: { errorId: unlockedCourtCase.errorId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.errorLockedByUsername).toBe(user.username)
      expect(actualCourtCase.triggerLockedByUsername).toBe(user.username)

      // Creates audit log events
      const apiResult = await axios(`${AUDIT_LOG_API_URL}/messages/${unlockedCourtCase.messageId}`)
      const auditLogs = (await apiResult.data) as [{ events: [{ timestamp: string; eventCode: string }] }]
      const events = auditLogs[0].events
      expect(events).toHaveLength(2)

      const lockedExceptionEvent = events.find((event) => event.eventCode === "exceptions.locked")
      const lockedTriggerEvent = events.find((event) => event.eventCode === "triggers.locked")

      expect(lockedExceptionEvent).toStrictEqual({
        category: "information",
        eventSource: "Bichard New UI",
        eventType: "Exception locked",
        timestamp: expect.anything(),
        user: user.username,
        eventCode: "exceptions.locked",
        attributes: {
          auditLogVersion: 2
        }
      })

      expect(lockedTriggerEvent).toStrictEqual({
        category: "information",
        eventSource: "Bichard New UI",
        eventType: "Trigger locked",
        timestamp: expect.anything(),
        user: user.username,
        eventCode: "triggers.locked",
        attributes: {
          auditLogVersion: 2
        }
      })
    })
  })

  describe("when there is an error", () => {
    it("Should return the error if fails to store audit logs", async () => {
      ;(storeAuditLogEvents as jest.Mock).mockImplementationOnce(() => new Error(`Error while calling audit log API`))

      const result = await lockCourtCase(dataSource, unlockedCourtCase.errorId, user).catch((error) => error)

      expect(result).toEqual(Error(`Error while calling audit log API`))

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: 0 } })
      const actualCourtCase = record as CourtCase

      expect(actualCourtCase.errorLockedByUsername).toBeNull()
      expect(actualCourtCase.triggerLockedByUsername).toBeNull()
    })

    it("Should not store audit log events if it fails to update the lock status", async () => {
      ;(updateLockStatusToLocked as jest.Mock).mockImplementationOnce(() => new Error(`Error while updating lock`))

      const result = await lockCourtCase(dataSource, unlockedCourtCase.errorId, user).catch((error) => error)

      expect(result).toEqual(Error(`Error while updating lock`))

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: 0 } })
      const actualCourtCase = record as CourtCase

      expect(actualCourtCase.errorLockedByUsername).toBeNull()
      expect(actualCourtCase.triggerLockedByUsername).toBeNull()

      const apiResult = await axios(`${AUDIT_LOG_API_URL}/messages/${unlockedCourtCase.messageId}`)
      const auditLogs = (await apiResult.data) as [{ events: [{ timestamp: string; eventCode: string }] }]
      const events = auditLogs[0].events

      expect(events).toHaveLength(0)
    })
  })
})

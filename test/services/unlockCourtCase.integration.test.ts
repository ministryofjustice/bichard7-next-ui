import User from "services/entities/User"
import { DataSource } from "typeorm"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import { isError } from "../../src/types/Result"
import deleteFromEntity from "../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"
import unlockCourtCase from "services/unlockCourtCase"
import { AUDIT_LOG_API_URL } from "../../src/config"
import deleteFromDynamoTable from "../utils/deleteFromDynamoTable"
import createAuditLog from "../helpers/createAuditLog"
import fetch from "node-fetch"
import courtCasesByOrganisationUnitQuery from "services/queries/courtCasesByOrganisationUnitQuery"
import updateLockStatusToUnlocked from "services/updateLockStatusToUnlocked"
import storeAuditLogEvents from "services/storeAuditLogEvents"

jest.mock("services/updateLockStatusToUnlocked")
jest.mock("services/storeAuditLogEvents")
jest.mock("services/queries/courtCasesByOrganisationUnitQuery")

describe("lock court case", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
    await deleteFromDynamoTable("auditLogTable", "messageId")
    await deleteFromDynamoTable("auditLogEventsTable", "_id")
    ;(updateLockStatusToUnlocked as jest.Mock).mockImplementation(
      jest.requireActual("services/updateLockStatusToUnlocked").default
    )
    ;(storeAuditLogEvents as jest.Mock).mockImplementation(jest.requireActual("services/storeAuditLogEvents").default)
    ;(courtCasesByOrganisationUnitQuery as jest.Mock).mockImplementation(
      jest.requireActual("services/queries/courtCasesByOrganisationUnitQuery").default
    )
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  describe("when a case is successfully unlocked", () => {
    const lockedByName = "some user"
    const user = {
      canLockExceptions: true,
      canLockTriggers: true,
      username: lockedByName,
      visibleForces: ["36FPA1"],
      visibleCourts: []
    } as Partial<User> as User

    it("Should call updateLockStatusToUnlocked, courtCasesByOrganisationUnitQuery and storeAuditLogEvents", async () => {
      const errorId = 0
      const [lockedCourtCase] = await insertCourtCasesWithFields([
        {
          errorLockedByUsername: lockedByName,
          triggerLockedByUsername: lockedByName,
          orgForPoliceFilter: "36FPA ",
          errorId: errorId
        }
      ])

      const expectedAuditLogEvent = {
        attributes: { auditLogVersion: 2, eventCode: "exceptions.unlocked", user: lockedByName },
        category: "information",
        eventSource: "Bichard New UI",
        eventType: "Exception unlocked",
        timestamp: expect.anything()
      }

      await unlockCourtCase(dataSource.manager, lockedCourtCase.errorId, user).catch((error) => error)

      expect(updateLockStatusToUnlocked).toHaveBeenCalledTimes(1)
      expect(updateLockStatusToUnlocked).toHaveBeenCalledWith(expect.any(Object), errorId, user, undefined, [
        expectedAuditLogEvent
      ])
      expect(courtCasesByOrganisationUnitQuery).toHaveBeenCalledTimes(1)
      expect(courtCasesByOrganisationUnitQuery).toHaveBeenCalledWith(expect.any(Object), user)
      expect(storeAuditLogEvents).toHaveBeenCalledTimes(1)
      expect(storeAuditLogEvents).toHaveBeenCalledWith(lockedCourtCase.messageId, [expectedAuditLogEvent])
    })

    it("Should unlock the case and update the audit log events", async () => {
      const [lockedCourtCase] = await insertCourtCasesWithFields([
        {
          errorLockedByUsername: lockedByName,
          triggerLockedByUsername: lockedByName,
          orgForPoliceFilter: "36FPA ",
          errorId: 1
        }
      ])

      await createAuditLog(lockedCourtCase.messageId)
      const result = await unlockCourtCase(dataSource.manager, lockedCourtCase.errorId, user)
      expect(isError(result)).toBe(false)

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: 1 } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.errorLockedByUsername).toBeNull()
      expect(actualCourtCase.triggerLockedByUsername).toBeNull()

      // Creates audit log events
      const apiResult = await fetch(`${AUDIT_LOG_API_URL}/messages/${lockedCourtCase.messageId}`)
      const auditLogs = (await apiResult.json()) as [{ events: [{ timestamp: string; eventCode: string }] }]
      const events = auditLogs[0].events
      const unlockedEvent = events.find((event) => event.eventCode === "exceptions.unlocked")

      expect(unlockedEvent).toStrictEqual({
        category: "information",
        eventSource: "Bichard New UI",
        eventType: "Exception unlocked",
        timestamp: expect.anything(),
        user: user.username,
        eventCode: "exceptions.unlocked",
        attributes: {
          auditLogVersion: 2
        }
      })
    })
  })
})

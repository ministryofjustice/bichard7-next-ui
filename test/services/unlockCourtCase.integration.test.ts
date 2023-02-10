import User from "services/entities/User"
import { DataSource, UpdateQueryBuilder } from "typeorm"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import unlockCourtCase from "../../src/services/unlockCourtCase"
import { isError } from "../../src/types/Result"
import deleteFromTable from "../utils/deleteFromTable"
import { getDummyCourtCase, insertCourtCases, insertCourtCasesWithFields } from "../utils/insertCourtCases"

describe("lock court case", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromTable(CourtCase)
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  describe("when user has permission to unlock a case", () => {
    it("should unlock a locked court case", async () => {
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
        canLockExceptions: true,
        canLockTriggers: true,
        username: lockedByName,
        visibleForces: ["36FPA1"]
      } as User

      const result = await unlockCourtCase(dataSource, 1, user)
      expect(isError(result)).toBe(false)

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: 1 } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.errorLockedByUsername).toBeNull()
      expect(actualCourtCase.triggerLockedByUsername).toBeNull()

      const anotherRecord = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: 2 } })
      const anotherCourtCase = anotherRecord as CourtCase
      expect(anotherCourtCase.errorLockedByUsername).toEqual(lockedByName)
      expect(anotherCourtCase.triggerLockedByUsername).toEqual(lockedByName)
    })

    it("should unlock exceptions lock of a court case", async () => {
      const lockedByName = "some user"
      const lockedCourtCase = await getDummyCourtCase({
        errorLockedByUsername: lockedByName,
        triggerLockedByUsername: lockedByName,
        orgForPoliceFilter: "36FPA "
      })
      await insertCourtCases(lockedCourtCase)

      const user = {
        canLockExceptions: true,
        canLockTriggers: false,
        username: lockedByName,
        visibleForces: ["36FPA1"]
      } as User

      const result = await unlockCourtCase(dataSource, lockedCourtCase.errorId, user)
      expect(isError(result)).toBe(false)

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: lockedCourtCase.errorId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.errorLockedByUsername).toBeNull()
      expect(actualCourtCase.triggerLockedByUsername).toBe(lockedByName)
    })

    it("should unlock triggers lock of a court case", async () => {
      const lockedByName = "some user"
      const lockedCourtCase = await getDummyCourtCase({
        errorLockedByUsername: lockedByName,
        triggerLockedByUsername: lockedByName,
        orgForPoliceFilter: "36FPA "
      })
      await insertCourtCases(lockedCourtCase)

      const user = {
        canLockExceptions: false,
        canLockTriggers: true,
        username: lockedByName,
        visibleForces: ["36FPA1"]
      } as User

      const result = await unlockCourtCase(dataSource, lockedCourtCase.errorId, user)
      expect(isError(result)).toBe(false)

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: lockedCourtCase.errorId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.errorLockedByUsername).toBe(lockedByName)
      expect(actualCourtCase.triggerLockedByUsername).toBeNull()
    })

    it("should unlock exception only when 'reasonToUnlock' specified", async () => {
      const lockedByName = "some user"
      const lockedCourtCase = await getDummyCourtCase({
        errorLockedByUsername: lockedByName,
        triggerLockedByUsername: lockedByName,
        orgForPoliceFilter: "36FPA "
      })
      await insertCourtCases(lockedCourtCase)

      const user = {
        canLockExceptions: true,
        canLockTriggers: true,
        username: lockedByName,
        visibleForces: ["36FPA1"]
      } as User

      const result = await unlockCourtCase(dataSource, lockedCourtCase.errorId, user, "Exception")
      expect(isError(result)).toBe(false)

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: lockedCourtCase.errorId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.errorLockedByUsername).toBeNull()
      expect(actualCourtCase.triggerLockedByUsername).toBe(lockedByName)
    })

    it("should unlock trigger only when 'reasonToUnlock' specified", async () => {
      const lockedByName = "some user"
      const lockedCourtCase = await getDummyCourtCase({
        errorLockedByUsername: lockedByName,
        triggerLockedByUsername: lockedByName,
        orgForPoliceFilter: "36FPA "
      })
      await insertCourtCases(lockedCourtCase)

      const user = {
        canLockExceptions: true,
        canLockTriggers: true,
        username: lockedByName,
        visibleForces: ["36FPA1"]
      } as User

      const result = await unlockCourtCase(dataSource, lockedCourtCase.errorId, user, "Trigger")
      expect(isError(result)).toBe(false)

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: lockedCourtCase.errorId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.triggerLockedByUsername).toBeNull()
      expect(actualCourtCase.errorLockedByUsername).toBe(lockedByName)
    })

    it("can unlock trigger when exception is not locked", async () => {
      const lockedByName = "some user"
      const lockedCourtCase = await getDummyCourtCase({
        triggerLockedByUsername: lockedByName,
        orgForPoliceFilter: "36FPA "
      })
      await insertCourtCases(lockedCourtCase)

      const user = {
        canLockExceptions: true,
        canLockTriggers: true,
        username: lockedByName,
        visibleForces: ["36FPA1"]
      } as User

      const result = await unlockCourtCase(dataSource, lockedCourtCase.errorId, user, "Trigger")
      expect(isError(result)).toBe(false)

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: lockedCourtCase.errorId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.triggerLockedByUsername).toBeNull()
      expect(actualCourtCase.errorLockedByUsername).toBeNull()
    })

    it("can unlock exception when trigger is not locked", async () => {
      const lockedByName = "some user"
      const lockedCourtCase = await getDummyCourtCase({
        errorLockedByUsername: lockedByName,
        orgForPoliceFilter: "36FPA "
      })
      await insertCourtCases(lockedCourtCase)

      const user = {
        canLockExceptions: true,
        canLockTriggers: true,
        username: lockedByName,
        visibleForces: ["36FPA1"]
      } as User

      const result = await unlockCourtCase(dataSource, lockedCourtCase.errorId, user, "Exception")
      expect(isError(result)).toBe(false)

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: lockedCourtCase.errorId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.triggerLockedByUsername).toBeNull()
      expect(actualCourtCase.errorLockedByUsername).toBeNull()
    })
  })

  describe("when user doesn't have permission to unlock a case", () => {
    it("can handle missing permission gracefully", async () => {
      const dummyErrorId = 0
      const user = {
        canLockExceptions: false,
        canLockTriggers: false,
        username: "Dummy username"
      } as User

      const result = await unlockCourtCase(dataSource, dummyErrorId, user)
      expect(isError(result)).toBe(true)

      const receivedError = result as Error

      expect(receivedError.message).toEqual("User hasn't got permission to unlock the case")
    })

    it("can handle missing permission gracefully when unlocking triggers", async () => {
      const dummyErrorId = 0
      const user = {
        canLockExceptions: true,
        canLockTriggers: false,
        username: "Dummy username"
      } as User

      const result = await unlockCourtCase(dataSource, dummyErrorId, user, "Trigger")
      expect(isError(result)).toBe(true)

      const receivedError = result as Error

      expect(receivedError.message).toEqual("User hasn't got permission to unlock the case")
    })

    it("can handle missing permission gracefully when unlocking exceptions", async () => {
      const dummyErrorId = 0
      const user = {
        canLockExceptions: false,
        canLockTriggers: true,
        username: "Dummy username"
      } as User

      const result = await unlockCourtCase(dataSource, dummyErrorId, user, "Exception")
      expect(isError(result)).toBe(true)

      const receivedError = result as Error

      expect(receivedError.message).toEqual("User hasn't got permission to unlock the case")
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
        canLockExceptions: true,
        canLockTriggers: true,
        username: "User with different name",
        visibleForces: ["36FPA1"]
      } as User

      const result = await unlockCourtCase(dataSource, lockedCourtCase.errorId, user)
      expect(isError(result)).toBe(false)

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: lockedCourtCase.errorId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.errorLockedByUsername).toEqual(lockedByName)
      expect(actualCourtCase.triggerLockedByUsername).toEqual(lockedByName)
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
        canLockExceptions: true,
        canLockTriggers: true,
        isSupervisor: true,
        username: "Sup User",
        visibleForces: ["36FPA1"]
      } as User

      const result = await unlockCourtCase(dataSource, lockedCourtCase.errorId, user)
      expect(isError(result)).toBe(false)

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: lockedCourtCase.errorId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.errorLockedByUsername).toBeNull()
      expect(actualCourtCase.triggerLockedByUsername).toBeNull()
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
        canLockExceptions: true,
        canLockTriggers: true,
        isSupervisor: true,
        username: "Sup User",
        visibleForces: ["13GH"]
      } as User

      const result = await unlockCourtCase(dataSource, lockedCourtCase.errorId, user)
      expect(isError(result)).toBe(false)

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: lockedCourtCase.errorId } })
      const actualCourtCase = record as CourtCase
      expect(actualCourtCase.errorLockedByUsername).toEqual(lockedByName)
      expect(actualCourtCase.triggerLockedByUsername).toEqual(lockedByName)
    })
  })

  describe("when there is an error", () => {
    it("should return the error when failed to unlock court case", async () => {
      jest
        .spyOn(UpdateQueryBuilder.prototype, "execute")
        .mockRejectedValue(Error("Failed to update record with some error"))

      const lockedCourtCase = await getDummyCourtCase({
        errorLockedByUsername: "dummy",
        triggerLockedByUsername: "dummy"
      })
      await insertCourtCases(lockedCourtCase)

      const user = {
        canLockExceptions: true,
        canLockTriggers: false,
        username: "dummy username",
        visibleForces: ["36FPA1"]
      } as User

      const result = await unlockCourtCase(dataSource, lockedCourtCase.errorId, user)
      expect(isError(result)).toBe(true)

      const receivedError = result as Error

      expect(receivedError.message).toEqual("Failed to update record with some error")
    })
  })
})

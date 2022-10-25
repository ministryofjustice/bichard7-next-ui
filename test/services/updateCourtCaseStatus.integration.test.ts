import { DataSource, UpdateResult } from "typeorm"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import deleteFromTable from "../utils/deleteFromTable"
import { getDummyCourtCase, insertCourtCases } from "../utils/insertCourtCases"
import updateCourtCaseStatus from "services/updateCourtCaseStatus"
import { isError } from "services/mq/types/Result"
import { ResolutionStatus } from "types/ResolutionStatus"
import User from "services/entities/User"

const courtCaseId = 0
const testUser = { username: "Test user" } as User

const insertRecord = async (
  errorLockedByUsername: string | null = null,
  triggerLockedByUsername: string | null = null,
  errorStatus: ResolutionStatus | null = null,
  triggerStatus: ResolutionStatus | null = null
) => {
  const existingCourtCasesDbObject = [
    await getDummyCourtCase({
      courtDate: new Date("2008-09-25"),
      orgForPoliceFilter: "36FPA1".padEnd(6, " "),
      errorId: courtCaseId,
      messageId: String(0).padStart(5, "x"),
      errorLockedByUsername: errorLockedByUsername,
      triggerLockedByUsername: triggerLockedByUsername,
      errorStatus: errorStatus,
      triggerStatus: triggerStatus
    }),
    await getDummyCourtCase({
      courtDate: new Date("2008-09-25"),
      orgForPoliceFilter: "36FPA1".padEnd(6, " "),
      errorId: 1,
      messageId: String(1).padStart(5, "x"),
      errorLockedByUsername: errorLockedByUsername,
      triggerLockedByUsername: triggerLockedByUsername,
      errorStatus: errorStatus,
      triggerStatus: triggerStatus
    })
  ]

  await insertCourtCases(existingCourtCasesDbObject)
}

describe("updateCourtCaseStatus", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromTable(CourtCase)
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it("should not update if the court case doesn't exist", async () => {
    const nonExistentCase = 9999
    const result = await updateCourtCaseStatus(dataSource, nonExistentCase, "Error", "Submitted", testUser)

    expect((result as UpdateResult).raw).toHaveLength(0)
    expect((result as UpdateResult).affected).toBe(0)
  })

  describe("Updating error status", () => {
    it("should not update if the court case if its locked by another user", async () => {
      const errorLockedByUsername = "Another User"
      await insertRecord(errorLockedByUsername)

      const result = await updateCourtCaseStatus(dataSource, 0, "Error", "Submitted", testUser)

      expect((result as UpdateResult).raw).toHaveLength(0)
      expect((result as UpdateResult).affected).toBe(0)
    })

    it("should not update if the court case if the current error status is not set", async () => {
      const errorLockedByUsername = testUser.username
      const triggerLockedByUsername = testUser.username
      await insertRecord(errorLockedByUsername, triggerLockedByUsername, null, null)

      const result = await updateCourtCaseStatus(dataSource, 0, "Error", "Submitted", testUser)

      expect((result as UpdateResult).raw).toHaveLength(0)
      expect((result as UpdateResult).affected).toBe(0)
    })

    it("can update when its not locked and error status is not null", async () => {
      const errorStatus = "Unresolved"
      await insertRecord(null, null, errorStatus, null)

      const result = await updateCourtCaseStatus(dataSource, 0, "Error", "Submitted", testUser)
      expect(isError(result)).toBe(false)

      const updateResult = result as UpdateResult
      expect(updateResult.raw).toHaveLength(1)

      const courtCaseRow = updateResult.raw[0]
      expect(courtCaseRow.error_status).toEqual(3)
      expect(courtCaseRow.trigger_status).toBeNull()
    })

    it("can update when its locked by the user and error status is not null", async () => {
      const errorLockedByUsername = testUser.username
      const errorStatus = "Unresolved"
      await insertRecord(errorLockedByUsername, null, errorStatus, null)

      const result = await updateCourtCaseStatus(dataSource, 0, "Error", "Submitted", testUser)
      expect(isError(result)).toBe(false)

      const updateResult = result as UpdateResult
      expect(updateResult.raw).toHaveLength(1)

      const courtCaseRow = updateResult.raw[0]
      expect(courtCaseRow.error_status).toEqual(3)
      expect(courtCaseRow.trigger_status).toBeNull()
    })
  })

  describe("can update when its locked by the user", () => {
    it("can update when its not locked and trigger status is not null", async () => {
      const triggerStatus = "Unresolved"
      await insertRecord(null, null, null, triggerStatus)

      const result = await updateCourtCaseStatus(dataSource, 0, "Trigger", "Submitted", testUser)
      expect(isError(result)).toBe(false)

      const updateResult = result as UpdateResult
      expect(updateResult.raw).toHaveLength(1)

      const courtCaseRow = updateResult.raw[0]
      expect(courtCaseRow.trigger_status).toEqual(3)
      expect(courtCaseRow.error_status).toBeNull()
    })

    it("can update when its locked by the user and trigger status is not null", async () => {
      const triggerLockedByUsername = testUser.username
      const triggerStatus = "Unresolved"

      await insertRecord(null, triggerLockedByUsername, null, triggerStatus)

      const result = await updateCourtCaseStatus(dataSource, 0, "Trigger", "Submitted", testUser)
      expect(isError(result)).toBe(false)

      const updateResult = result as UpdateResult
      expect(updateResult.raw).toHaveLength(1)

      const courtCaseRow = updateResult.raw[0]
      expect(courtCaseRow.trigger_status).toEqual(3)
      expect(courtCaseRow.error_status).toBeNull()
    })
  })
})

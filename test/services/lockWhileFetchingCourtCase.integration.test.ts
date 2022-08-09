import CourtCase from "../../src/services/entities/CourtCase"
import User from "../../src/services/entities/User"
import getDataSource from "../../src/services/getDataSource"
import {
  lockWhileFetchingCourtCase,
  LockWhileFetchingCourtCaseResult
} from "../../src/services/lockWhileFetchingCourtCase"
import { DataSource } from "typeorm"
import { isError } from "../../src/types/Result"
import CourtCaseCase from "../testFixtures/database/data/error_list.json"
import CourtCaseAho from "../testFixtures/database/data/error_list_aho.json"
import deleteFromTable from "../testFixtures/database/deleteFromTable"
import { insertCourtCases } from "../testFixtures/database/insertCourtCases"
import { expect } from "@jest/globals"

const getCourtCase = jest.requireActual("../../src/services/getCourtCase").default

const unlockedCourtCase = {
  ...CourtCaseCase,
  annotated_msg: CourtCaseAho.annotated_msg,
  court_date: "2008-09-25",
  org_for_police_filter: "36FPA1".padEnd(6, " "),
  error_id: 0,
  message_id: String(0).padStart(5, "x"),
  error_locked_by_id: null,
  trigger_locked_by_id: null
}

const insertRecords = async (errorLockedById: string | null = null, triggerLockedById: string | null = null) => {
  const existingCourtCases = [
    {
      ...unlockedCourtCase,
      error_locked_by_id: errorLockedById,
      trigger_locked_by_id: triggerLockedById
    }
  ]

  await insertCourtCases(existingCourtCases)
}

describe("Court case details page", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    jest.clearAllMocks()
    await deleteFromTable(CourtCase)
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it("should not override the lock when the record is locked by another user", async () => {
    await insertRecords()
    jest.mock("../../src/services/getCourtCase", () => {
      return {
        default: jest.fn(() => unlockedCourtCase)
      }
    })

    await lockWhileFetchingCourtCase(
      { username: "bichard01", visibleForces: ["36"] } as unknown as User,
      unlockedCourtCase.error_id.toString(),
      dataSource
    )
    await lockWhileFetchingCourtCase(
      { username: "bichard02", visibleForces: ["36"] } as unknown as User,
      unlockedCourtCase.error_id.toString(),
      dataSource
    )
    const updatedCourtCaseResult = await getCourtCase(dataSource, unlockedCourtCase.error_id, ["36"])

    expect(isError(updatedCourtCaseResult)).toBeFalsy()

    const updatedCourtCase = updatedCourtCaseResult as CourtCase

    expect(updatedCourtCase.errorLockedById).toBe("bichard01")
    expect(updatedCourtCase.triggerLockedById).toBe("bichard01")
  })

  it("should show the case as being locked to only one user when multiple users attempt to lock the case", async () => {
    await insertRecords()
    // Return the unlocked case the first two times, with a 1 second delay before returning, then behave as normal.
    // This is to simulate a race condition where two users both retrieve the case, receive the unlocked case and try to lock it concurrently.
    jest.mock("../../src/services/getCourtCase", () => {
      return {
        default: jest
          .fn()
          .mockImplementationOnce(() => new Promise((resolve) => setTimeout(() => resolve(unlockedCourtCase), 1_000)))
          .mockImplementationOnce(() => new Promise((resolve) => setTimeout(() => resolve(unlockedCourtCase), 1_000)))
          .mockRestore()
      }
    })

    const resultsReceived = await Promise.all([
      lockWhileFetchingCourtCase(
        { username: "bichard01", visibleForces: ["36"] } as unknown as User,
        unlockedCourtCase.error_id.toString(),
        dataSource
      ),
      lockWhileFetchingCourtCase(
        { username: "bichard02", visibleForces: ["36"] } as unknown as User,
        unlockedCourtCase.error_id.toString(),
        dataSource
      )
    ])

    expect(resultsReceived).toHaveLength(2)
    resultsReceived.forEach((courtCaseResult) => {
      expect(isError(courtCaseResult)).toBeFalsy()
      expect(courtCaseResult).not.toBeNull()
      expect((courtCaseResult as unknown as LockWhileFetchingCourtCaseResult).courtCase).toBeDefined()
    })

    const results = resultsReceived.map((result) => result as unknown as LockWhileFetchingCourtCaseResult)

    expect(results[0].courtCase?.errorLockedById).toBeDefined()
    expect(results[0].courtCase?.errorLockedById).toEqual(results[1].courtCase?.errorLockedById)
    expect(results[0].courtCase?.triggerLockedById).toBeDefined()
    expect(results[0].courtCase?.triggerLockedById).toEqual(results[1].courtCase?.triggerLockedById)
  })
})

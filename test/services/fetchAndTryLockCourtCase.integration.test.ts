import CourtCase from "../../src/services/entities/CourtCase"
import User from "../../src/services/entities/User"
import getDataSource from "../../src/services/getDataSource"
import { fetchAndTryLockCourtCase } from "../../src/services/fetchAndTryLockCourtCase"
import { DataSource } from "typeorm"
import { isError } from "../../src/types/Result"
import CourtCaseCase from "../testFixtures/database/data/error_list.json"
import CourtCaseAho from "../testFixtures/database/data/error_list_aho.json"
import deleteFromTable from "../testFixtures/database/deleteFromTable"
import { insertCourtCases } from "../testFixtures/database/insertCourtCases"
import { expect } from "@jest/globals"

const getCourtCase = jest.requireActual("../../src/services/getCourtCase").default

const unlockedCourtCaseDbObject = {
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
  const existingCourtCasesDbObject = [
    {
      ...unlockedCourtCaseDbObject,
      error_locked_by_id: errorLockedById,
      trigger_locked_by_id: triggerLockedById
    }
  ]

  await insertCourtCases(existingCourtCasesDbObject)
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

  it("should lock an unlocked case when fetched", async () => {
    await insertRecords()
    jest.mock("../../src/services/getCourtCase", () => {
      return {
        default: jest.fn(() => unlockedCourtCaseDbObject)
      }
    })

    const expectedCourtCase: CourtCase = await getCourtCase(dataSource, unlockedCourtCaseDbObject.error_id, ["36"])
    expectedCourtCase.errorLockedById = "bichard01"
    expectedCourtCase.triggerLockedById = "bichard01"

    await fetchAndTryLockCourtCase(
      { username: "bichard01", visibleForces: ["36"] } as unknown as User,
      unlockedCourtCaseDbObject.error_id,
      dataSource
    )

    const actualCourtCase: CourtCase = await getCourtCase(dataSource, unlockedCourtCaseDbObject.error_id, ["36"])

    expect(isError(actualCourtCase)).toBeFalsy()
    expect(actualCourtCase).toStrictEqual(expectedCourtCase)
  })

  it("shouldn't override the lock when the record is locked by current user", async () => {
    await insertRecords()
    jest.mock("../../src/services/getCourtCase", () => {
      return {
        default: jest.fn(() => unlockedCourtCaseDbObject)
      }
    })

    const expectedCourtCase: CourtCase = await getCourtCase(dataSource, unlockedCourtCaseDbObject.error_id, ["36"])
    expectedCourtCase.errorLockedById = "bichard01"
    expectedCourtCase.triggerLockedById = "bichard01"

    await fetchAndTryLockCourtCase(
      { username: "bichard01", visibleForces: ["36"] } as unknown as User,
      unlockedCourtCaseDbObject.error_id,
      dataSource
    )

    await fetchAndTryLockCourtCase(
      { username: "bichard01", visibleForces: ["36"] } as unknown as User,
      unlockedCourtCaseDbObject.error_id,
      dataSource
    )

    const actualCourtCase: CourtCase = await getCourtCase(dataSource, unlockedCourtCaseDbObject.error_id, ["36"])

    expect(isError(actualCourtCase)).toBeFalsy()
    expect(actualCourtCase).toStrictEqual(expectedCourtCase)
  })

  it("shouldn't override the lock when the record is locked by another user", async () => {
    await insertRecords()
    jest.mock("../../src/services/getCourtCase", () => {
      return {
        default: jest.fn(() => unlockedCourtCaseDbObject)
      }
    })

    const expectedCourtCase: CourtCase = await getCourtCase(dataSource, unlockedCourtCaseDbObject.error_id, ["36"])
    expectedCourtCase.errorLockedById = "bichard01"
    expectedCourtCase.triggerLockedById = "bichard01"

    await fetchAndTryLockCourtCase(
      { username: "bichard01", visibleForces: ["36"] } as unknown as User,
      unlockedCourtCaseDbObject.error_id,
      dataSource
    )
    await fetchAndTryLockCourtCase(
      { username: "bichard02", visibleForces: ["36"] } as unknown as User,
      unlockedCourtCaseDbObject.error_id,
      dataSource
    )

    const actualCourtCase: CourtCase = await getCourtCase(dataSource, unlockedCourtCaseDbObject.error_id, ["36"])

    expect(isError(actualCourtCase)).toBeFalsy()
    expect(actualCourtCase).toStrictEqual(expectedCourtCase)
  })
})

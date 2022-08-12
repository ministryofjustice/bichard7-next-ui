import CourtCase from "../../src/services/entities/CourtCase"
import User from "../../src/services/entities/User"
import getDataSource from "../../src/services/getDataSource"
import { fetchAndTryLockCourtCase } from "../../src/services/fetchAndTryLockCourtCase"
import { DataSource } from "typeorm"
import { isError } from "../../src/types/Result"
import deleteFromTable from "../testFixtures/database/deleteFromTable"
import { getDummyCourtCase, insertCourtCases } from "../testFixtures/database/insertCourtCases"
import { expect } from "@jest/globals"

const getCourtCase = jest.requireActual("../../src/services/getCourtCase").default

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
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  it("should lock an unlocked case when fetched", async () => {
    const inputCourtCase = await getDummyCourtCase({
      errorLockedById: null,
      triggerLockedById: null
    })
    await insertCourtCases(inputCourtCase)

    const userName = "bichard01"
    const expectedCourtCase = await getDummyCourtCase({
      errorLockedById: userName,
      triggerLockedById: userName
    })

    await fetchAndTryLockCourtCase(
      { username: userName, visibleForces: ["36"] } as User,
      inputCourtCase.errorId,
      dataSource
    )

    const actualCourtCase: CourtCase = await getCourtCase(dataSource, inputCourtCase.errorId, ["36"])

    expect(isError(actualCourtCase)).toBeFalsy()
    expect(actualCourtCase).toStrictEqual(expectedCourtCase)
  })

  it("shouldn't override the lock when the record is locked by current user", async () => {
    const userName = "bichard01"
    const inputCourtCase = await getDummyCourtCase({
      errorLockedById: userName,
      triggerLockedById: userName
    })
    await insertCourtCases(inputCourtCase)

    await fetchAndTryLockCourtCase(
      { username: "bichard01", visibleForces: ["36"] } as unknown as User,
      inputCourtCase.errorId,
      dataSource
    )

    const actualCourtCase: CourtCase = await getCourtCase(dataSource, inputCourtCase.errorId, ["36"])

    expect(isError(actualCourtCase)).toBeFalsy()
    expect(actualCourtCase).toStrictEqual(inputCourtCase)
  })

  it("shouldn't override the lock when the record is locked by another user", async () => {
    const userName = "bichard01"
    const inputCourtCase = await getDummyCourtCase({
      errorLockedById: userName,
      triggerLockedById: userName
    })
    await insertCourtCases(inputCourtCase)

    jest.mock("../../src/services/getCourtCase", () => {
      return {
        default: jest.fn(() => inputCourtCase)
      }
    })

    await fetchAndTryLockCourtCase(
      { username: "bichard02", visibleForces: ["36"] } as unknown as User,
      inputCourtCase.errorId,
      dataSource
    )

    const actualCourtCase: CourtCase = await getCourtCase(dataSource, inputCourtCase.errorId, ["36"])

    expect(isError(actualCourtCase)).toBeFalsy()
    expect(actualCourtCase).toStrictEqual(inputCourtCase)
  })
})

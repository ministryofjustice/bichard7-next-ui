import { expect } from "@jest/globals"
import getCourtCase from "../../src/services/getCourtCase"
import { DataSource } from "typeorm"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import tryToLockCourtCase from "../../src/services/tryToLockCourtCase"
import { isError } from "../../src/types/Result"
import deleteFromTable from "../util/deleteFromTable"
import { getDummyCourtCase, insertCourtCases } from "../testFixtures/database/insertCourtCases"

describe("lock court case", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromTable(CourtCase)
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  it("should lock a unlocked court case when viewed", async () => {
    const userName = "Bichard01"
    const inputCourtCase = await getDummyCourtCase({
      errorLockedById: null,
      triggerLockedById: null
    })
    await insertCourtCases(inputCourtCase)

    const result = await tryToLockCourtCase(dataSource, inputCourtCase.errorId, userName)
    expect(isError(result)).toBe(false)
    expect(result).toBeTruthy()

    const expectedCourtCase = await getDummyCourtCase({
      errorLockedById: userName,
      triggerLockedById: userName
    })

    const actualCourtCase = await getCourtCase(dataSource, inputCourtCase.errorId, ["36"])
    expect(actualCourtCase).toStrictEqual(expectedCourtCase)
  })

  it("should not lock a court case when its already locked", async () => {
    const userName = "Bichard01"
    const anotherUser = "anotherUserName"

    const inputCourtCase = await getDummyCourtCase({
      errorLockedById: anotherUser,
      triggerLockedById: anotherUser
    })
    await insertCourtCases(inputCourtCase)

    const result = await tryToLockCourtCase(dataSource, inputCourtCase.errorId, userName)
    expect(isError(result)).toBe(false)
    expect(result).toBeTruthy()

    const actualCourtCase = await getCourtCase(dataSource, inputCourtCase.errorId, ["36"])
    expect(actualCourtCase).toStrictEqual(inputCourtCase)
  })
})

import { expect } from "@jest/globals"
import { DataSource } from "typeorm"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import tryToLockCourtCase from "../../src/services/tryToLockCourtCase"
import { isError } from "../../src/types/Result"
import CourtCaseCase from "../testFixtures/database/data/error_list.json"
import CourtCaseAho from "../testFixtures/database/data/error_list_aho.json"
import deleteFromTable from "../testFixtures/database/deleteFromTable"
import { insertCourtCases } from "../testFixtures/database/insertCourtCases"

const insertRecords = async (errorLockedById: string | null = null, triggerLockedById: string | null = null) => {
  const existingCourtCases = [
    {
      ...CourtCaseCase,
      annotated_msg: CourtCaseAho.annotated_msg,
      court_date: "2008-09-25",
      org_for_police_filter: "36FPA1".padEnd(6, " "),
      error_id: 0,
      message_id: String(0).padStart(5, "x"),
      error_locked_by_id: errorLockedById,
      trigger_locked_by_id: triggerLockedById
    }
  ]

  await insertCourtCases(existingCourtCases)
}

describe("lock court case", () => {
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

  it("should lock a unlocked court case when viewed", async () => {
    await insertRecords()
    const existingCourtCase = (await dataSource
      .getRepository(CourtCase)
      .findOne({ where: { errorId: 0 } })) as CourtCase

    const userName = "Bichard01"
    const result = await tryToLockCourtCase(dataSource, existingCourtCase.errorId, userName)
    expect(isError(result)).toBe(false)

    const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: 0 } })
    const actualCourtCase = record as CourtCase
    expect(actualCourtCase.errorLockedById).toStrictEqual(userName)
    expect(actualCourtCase.triggerLockedById).toStrictEqual(userName)
  })

  it("should not lock a court case when its already locked", async () => {
    const anotherUser = "anotherUserName"
    await insertRecords(anotherUser, anotherUser)
    const existingCourtCase = (await dataSource
      .getRepository(CourtCase)
      .findOne({ where: { errorId: 0 } })) as CourtCase

    const result = await tryToLockCourtCase(dataSource, existingCourtCase.errorId, "Bichard01")
    expect(isError(result)).toBe(false)

    const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: 0 } })
    const actualCourtCase = record as CourtCase
    expect(actualCourtCase.errorLockedById).toStrictEqual(anotherUser)
    expect(actualCourtCase.triggerLockedById).toStrictEqual(anotherUser)
  })

  // These tests are out of scope until separate case and trigger locking is implemented
  //
  // it("should allow locking triggers when errors are locked", async () => {
  //   const errorLockedById = "anotherUserName"
  //   await insertRecords(errorLockedById)
  //   const existingCourtCase = (await dataSource
  //     .getRepository(CourtCase)
  //     .findOne({ where: { errorId: 0 } })) as CourtCase

  //   const userName = "Bichard01"
  //   const result = await tryToLockCourtCase(dataSource, existingCourtCase.errorId, userName)
  //   expect(isError(result)).toBe(false)

  //   const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: 0 } })
  //   const actualCourtCase = record as CourtCase
  //   expect(actualCourtCase.errorLockedById).toStrictEqual(errorLockedById)
  //   expect(actualCourtCase.triggerLockedById).toStrictEqual(userName)
  // })

  // it("should allow locking triggers when errors are locked", async () => {
  //   const triggerLockedById = "anotherUserName"
  //   await insertRecords(null, triggerLockedById)
  //   const existingCourtCase = (await dataSource
  //     .getRepository(CourtCase)
  //     .findOne({ where: { errorId: 0 } })) as CourtCase
  //   const userName = "Bichard01"
  //   const result = await tryToLockCourtCase(dataSource, existingCourtCase.errorId, userName)
  //   expect(isError(result)).toBe(false)

  //   const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: 0 } })
  //   const actualCourtCase = record as CourtCase
  //   expect(actualCourtCase.errorLockedById).toStrictEqual(userName)
  //   expect(actualCourtCase.triggerLockedById).toStrictEqual(triggerLockedById)
  // })
})

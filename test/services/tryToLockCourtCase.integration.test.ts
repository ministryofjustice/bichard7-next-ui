import User from "services/entities/User"
import { DataSource } from "typeorm"
import CourtCase from "../../src/services/entities/CourtCase"
import getCourtCaseByOrganisationUnit from "../../src/services/getCourtCaseByOrganisationUnit"
import getDataSource from "../../src/services/getDataSource"
import tryToLockCourtCase from "../../src/services/tryToLockCourtCase"
import { isError } from "../../src/types/Result"
import deleteFromEntity from "../utils/deleteFromEntity"
import { getDummyCourtCase, insertCourtCases } from "../utils/insertCourtCases"

describe("lock court case", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  it("should lock a unlocked court case when viewed", async () => {
    const username = "Bichard01"
    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      triggerStatus: "Unresolved"
    })
    await insertCourtCases(inputCourtCase)

    const user = {
      username,
      canLockExceptions: true,
      canLockTriggers: true,
      visibleForces: ["36"],
      visibleCourts: []
    } as Partial<User> as User

    const result = await tryToLockCourtCase(dataSource, inputCourtCase.errorId, user)
    expect(isError(result)).toBe(false)
    expect(result).toBeTruthy()

    const expectedCourtCase = await getDummyCourtCase({
      errorLockedByUsername: username,
      triggerLockedByUsername: username,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      triggerStatus: "Unresolved"
    })

    const actualCourtCase = await getCourtCaseByOrganisationUnit(dataSource, inputCourtCase.errorId, user)
    expect(actualCourtCase).toStrictEqual(expectedCourtCase)
  })

  it("should not lock a court case when its already locked", async () => {
    const username = "Bichard01"
    const anotherUser = "anotherUserName"

    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: anotherUser,
      triggerLockedByUsername: anotherUser,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      triggerStatus: "Unresolved"
    })
    await insertCourtCases(inputCourtCase)

    const user = {
      username,
      canLockExceptions: true,
      canLockTriggers: true,
      visibleForces: ["36"],
      visibleCourts: []
    } as Partial<User> as User

    const result = await tryToLockCourtCase(dataSource, inputCourtCase.errorId, user)
    expect(isError(result)).toBe(false)
    expect(result).toBeTruthy()

    const actualCourtCase = await getCourtCaseByOrganisationUnit(dataSource, inputCourtCase.errorId, user)
    expect(actualCourtCase).toStrictEqual(inputCourtCase)
  })

  it("should not lock a court case exception but it should lock a court case trigger", async () => {
    const username = "Bichard01"
    const anotherUser = "anotherUserName"

    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: anotherUser,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      triggerStatus: "Unresolved"
    })
    await insertCourtCases(inputCourtCase)

    const user = {
      username,
      canLockExceptions: false,
      canLockTriggers: true,
      visibleForces: ["36"],
      visibleCourts: []
    } as Partial<User> as User

    const result = await tryToLockCourtCase(dataSource, inputCourtCase.errorId, user)

    const expectedCourtCase = await getDummyCourtCase({
      errorLockedByUsername: anotherUser,
      triggerLockedByUsername: username,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      triggerStatus: "Unresolved"
    })

    expect(isError(result)).toBe(false)
    expect(result).toBeTruthy()

    const actualCourtCase = await getCourtCaseByOrganisationUnit(dataSource, inputCourtCase.errorId, user)
    expect(actualCourtCase).toStrictEqual(expectedCourtCase)
  })

  it("should not lock a court case trigger but it should lock a court case exception", async () => {
    const username = "Bichard01"
    const anotherUser = "anotherUserName"

    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: anotherUser,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      triggerStatus: "Unresolved"
    })
    await insertCourtCases(inputCourtCase)

    const user = {
      username,
      canLockExceptions: true,
      canLockTriggers: false,
      visibleForces: ["36"],
      visibleCourts: []
    } as Partial<User> as User

    const result = await tryToLockCourtCase(dataSource, inputCourtCase.errorId, user)

    const expectedCourtCase = await getDummyCourtCase({
      errorLockedByUsername: username,
      triggerLockedByUsername: anotherUser,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      triggerStatus: "Unresolved"
    })

    expect(isError(result)).toBe(false)
    expect(result).toBeTruthy()

    const actualCourtCase = await getCourtCaseByOrganisationUnit(dataSource, inputCourtCase.errorId, user)
    expect(actualCourtCase).toStrictEqual(expectedCourtCase)
  })

  it("should not lock court case trigger, when trigger resolution status is Submitted", async () => {
    const username = "Bichard01"

    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      triggerStatus: "Submitted",
      errorStatus: "Unresolved",
      triggerCount: 1
    })
    await insertCourtCases(inputCourtCase)

    const user = {
      username,
      canLockExceptions: false,
      canLockTriggers: true,
      visibleForces: ["36"],
      visibleCourts: []
    } as Partial<User> as User

    const result = await tryToLockCourtCase(dataSource, inputCourtCase.errorId, user)

    const expectedCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      triggerStatus: "Submitted",
      errorStatus: "Unresolved",
      triggerCount: 1
    })

    expect(isError(result)).toBe(false)
    expect(result).toBeTruthy()

    const actualCourtCase = await getCourtCaseByOrganisationUnit(dataSource, inputCourtCase.errorId, user)
    expect(actualCourtCase).toStrictEqual(expectedCourtCase)
  })

  it("should not lock a court case exception, when exception resolution status is Submitted", async () => {
    const username = "Bichard01"

    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      errorStatus: "Submitted",
      triggerCount: 1,
      triggerStatus: "Unresolved"
    })
    await insertCourtCases(inputCourtCase)

    const user = {
      username,
      canLockExceptions: true,
      canLockTriggers: false,
      visibleForces: ["36"],
      visibleCourts: []
    } as Partial<User> as User

    const result = await tryToLockCourtCase(dataSource, inputCourtCase.errorId, user)

    const expectedCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      triggerStatus: "Unresolved",
      errorCount: 0,
      errorStatus: "Submitted",
      triggerCount: 1
    })

    expect(isError(result)).toBe(false)
    expect(result).toBeTruthy()

    const actualCourtCase = await getCourtCaseByOrganisationUnit(dataSource, inputCourtCase.errorId, user)
    expect(actualCourtCase).toStrictEqual(expectedCourtCase)
  })

  it("should return an error if we haven't got a specific lock to lock", async () => {
    const username = "Bichard01"

    const inputCourtCase = await getDummyCourtCase({
      errorLockedByUsername: null,
      triggerLockedByUsername: null,
      errorCount: 1,
      errorStatus: "Unresolved",
      triggerCount: 1,
      triggerStatus: "Unresolved"
    })
    await insertCourtCases(inputCourtCase)

    const user = {
      username,
      canLockExceptions: false,
      canLockTriggers: false,
      visibleCourts: [],
      visibleForces: ["36"]
    } as Partial<User> as User

    const result = await tryToLockCourtCase(dataSource, inputCourtCase.errorId, user)
    expect(isError(result)).toBe(true)
    expect(result).toEqual(new Error("update requires a lock (exception or trigger) to update"))

    const actualCourtCase = await getCourtCaseByOrganisationUnit(dataSource, inputCourtCase.errorId, user)
    expect(actualCourtCase).toStrictEqual(inputCourtCase)
  })
})

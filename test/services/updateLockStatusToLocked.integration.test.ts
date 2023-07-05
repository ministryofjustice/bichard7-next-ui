import User from "services/entities/User"
import { DataSource } from "typeorm"
import CourtCase from "../../src/services/entities/CourtCase"
import getCourtCaseByOrganisationUnit from "../../src/services/getCourtCaseByOrganisationUnit"
import getDataSource from "../../src/services/getDataSource"
import updateLockStatusToLocked from "../../src/services/updateLockStatusToLocked"
import { isError } from "../../src/types/Result"
import deleteFromEntity from "../utils/deleteFromEntity"
import { getDummyCourtCase, insertCourtCases } from "../utils/insertCourtCases"
import type AuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AuditLogEvent"

describe("Update lock status to locked", () => {
  let dataSource: DataSource

  const exceptionLockedEvent = (username = "Bichard01") => ({
    category: "information",
    eventSource: "Bichard New UI",
    eventType: "Exception locked",
    timestamp: expect.anything(),
    attributes: {
      user: username,
      auditLogVersion: 2,
      eventCode: "exceptions.locked"
    }
  })
  const triggerLockedEvent = (username = "Bichard01") => ({
    category: "information",
    eventSource: "Bichard New UI",
    eventType: "Trigger locked",
    timestamp: expect.anything(),
    attributes: {
      user: username,
      auditLogVersion: 2,
      eventCode: "triggers.locked"
    }
  })

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

  it("Should lock a unlocked court case when viewed", async () => {
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
      visibleForces: ["36"],
      visibleCourts: [],
      hasAccessToExceptions: true,
      hasAccessToTriggers: true
    } as Partial<User> as User

    const events: AuditLogEvent[] = []
    const result = await updateLockStatusToLocked(dataSource.manager, inputCourtCase.errorId, user, events)
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
    expect(events).toStrictEqual([exceptionLockedEvent(), triggerLockedEvent()])
  })

  it("Should not lock a court case when its already locked", async () => {
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
      visibleForces: ["36"],
      visibleCourts: [],
      hasAccessToExceptions: true,
      hasAccessToTriggers: true
    } as Partial<User> as User

    const events: AuditLogEvent[] = []
    const result = await updateLockStatusToLocked(dataSource.manager, inputCourtCase.errorId, user, events)
    expect(isError(result)).toBe(false)
    expect(result).toBeTruthy()

    const actualCourtCase = await getCourtCaseByOrganisationUnit(dataSource, inputCourtCase.errorId, user)
    expect(actualCourtCase).toStrictEqual(inputCourtCase)
    expect(events).toHaveLength(0)
  })

  it("Should not lock a court case exception but it should lock a court case trigger", async () => {
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
      visibleForces: ["36"],
      visibleCourts: [],
      hasAccessToExceptions: false,
      hasAccessToTriggers: true
    } as Partial<User> as User

    const events: AuditLogEvent[] = []
    const result = await updateLockStatusToLocked(dataSource.manager, inputCourtCase.errorId, user, events)

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
    expect(events).toStrictEqual([triggerLockedEvent()])
  })

  it("Should not lock a court case trigger but it should lock a court case exception", async () => {
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
      visibleForces: ["36"],
      visibleCourts: [],
      hasAccessToExceptions: true,
      hasAccessToTriggers: false
    } as Partial<User> as User

    const events: AuditLogEvent[] = []
    const result = await updateLockStatusToLocked(dataSource.manager, inputCourtCase.errorId, user, events)

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
    expect(events).toStrictEqual([exceptionLockedEvent()])
  })

  it("Should not lock court case trigger, when trigger resolution status is Submitted", async () => {
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
      visibleForces: ["36"],
      visibleCourts: [],
      hasAccessToExceptions: true,
      hasAccessToTriggers: true
    } as Partial<User> as User

    const events: AuditLogEvent[] = []
    const result = await updateLockStatusToLocked(dataSource.manager, inputCourtCase.errorId, user, events)

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
    expect(events).toHaveLength(0)
  })

  it("Should not lock a court case exception, when exception resolution status is Submitted", async () => {
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
      visibleForces: ["36"],
      visibleCourts: [],
      hasAccessToExceptions: true,
      hasAccessToTriggers: true
    } as Partial<User> as User

    const events: AuditLogEvent[] = []
    const result = await updateLockStatusToLocked(dataSource.manager, inputCourtCase.errorId, user, events)

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
    expect(events).toHaveLength(0)
  })

  it("Should return an error if we haven't got a specific lock to lock", async () => {
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
      visibleCourts: [],
      visibleForces: ["36"],
      hasAccessToExceptions: false,
      hasAccessToTriggers: false
    } as Partial<User> as User

    const events: AuditLogEvent[] = []
    const result = await updateLockStatusToLocked(dataSource.manager, inputCourtCase.errorId, user, events)
    expect(isError(result)).toBe(true)
    expect(result).toEqual(new Error("update requires a lock (exception or trigger) to update"))

    const actualCourtCase = await getCourtCaseByOrganisationUnit(dataSource, inputCourtCase.errorId, user)
    expect(actualCourtCase).toStrictEqual(inputCourtCase)
    expect(events).toHaveLength(0)
  })
})

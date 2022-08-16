import { expect } from "@jest/globals"
import { differenceInMinutes } from "date-fns"
import { DataSource } from "typeorm"
import { isError } from "types/Result"
import CourtCase from "../../src/services/entities/CourtCase"
import Trigger from "../../src/services/entities/Trigger"
import getCourtCase from "../../src/services/getCourtCase"
import getDataSource from "../../src/services/getDataSource"
import resolveTrigger from "../../src/services/resolveTrigger"
import deleteFromTable from "../util/deleteFromTable"
import { insertCourtCasesWithOrgCodes, insertDummyCourtCaseWithLock } from "../util/insertCourtCases"
import { insertTriggers, TestTrigger } from "../util/manageTriggers"

jest.setTimeout(100000)

describe("resolveTrigger", () => {
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

  describe("Mark trigger as resolved", () => {
    it("Should set the relevant columns when resolving a trigger", async () => {
      const resolverUsername = "triggerResolver01"
      const visibleForces = ["36"]

      await insertDummyCourtCaseWithLock(resolverUsername, resolverUsername, visibleForces)
      const trigger: TestTrigger = {
        triggerId: 0,
        triggerCode: "TRPR0001",
        status: "Unresolved",
        createdAt: new Date("2022-07-12T10:22:34.000Z")
      }
      await insertTriggers(0, [trigger])

      const beforeCourtCaseResult = await getCourtCase(dataSource, 0, visibleForces)
      expect(isError(beforeCourtCaseResult)).toBeFalsy()
      expect(beforeCourtCaseResult).not.toBeNull()
      const beforeCourtCase = beforeCourtCaseResult as CourtCase
      expect(beforeCourtCase.triggerResolvedBy).toBeNull()
      expect(beforeCourtCase.triggerResolvedTimestamp).toBeNull()

      const result = await resolveTrigger(dataSource, 0, 0, resolverUsername, visibleForces)

      expect(isError(result)).toBeFalsy()
      expect(result as boolean).toBeTruthy()

      const retrievedTrigger = await dataSource
        .getRepository(Trigger)
        .findOne({ where: { triggerId: trigger.triggerId } })
      expect(retrievedTrigger).not.toBeNull()
      const updatedTrigger = retrievedTrigger as Trigger

      expect(updatedTrigger.resolvedAt).not.toBeNull()
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const minsSinceResolved = differenceInMinutes(new Date(), updatedTrigger.resolvedAt!)
      expect(minsSinceResolved).toBeGreaterThanOrEqual(0)
      expect(minsSinceResolved).toBeLessThanOrEqual(5)

      expect(updatedTrigger.resolvedBy).not.toBeNull()
      expect(updatedTrigger.resolvedBy).toStrictEqual(resolverUsername)
      expect(updatedTrigger.status).toStrictEqual("Resolved")

      const afterCourtCaseResult = await getCourtCase(dataSource, 0, visibleForces)
      expect(isError(afterCourtCaseResult)).toBeFalsy()
      expect(afterCourtCaseResult).not.toBeNull()
      const afterCourtCase = afterCourtCaseResult as CourtCase

      expect(afterCourtCase.triggerResolvedBy).toStrictEqual(resolverUsername)
      expect(afterCourtCase.triggerResolvedTimestamp).not.toBeNull()
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const minsSinceCaseTriggersResolved = differenceInMinutes(new Date(), afterCourtCase.triggerResolvedTimestamp!)
      expect(minsSinceCaseTriggersResolved).toBeGreaterThanOrEqual(0)
      expect(minsSinceCaseTriggersResolved).toBeLessThanOrEqual(5)
    })

    it("Shouldn't overwrite an already resolved trigger when attempting to resolve again", async () => {
      const resolverUsername = "triggerResolver01"
      const reResolverUsername = "triggerResolver02"
      const visibleForces = ["36"]

      await insertDummyCourtCaseWithLock(resolverUsername, resolverUsername, visibleForces)
      const trigger: TestTrigger = {
        triggerId: 0,
        triggerCode: "TRPR0001",
        status: "Unresolved",
        createdAt: new Date("2022-07-12T10:22:34.000Z")
      }
      await insertTriggers(0, [trigger])

      // Resolve trigger
      const initialResolveResult = await resolveTrigger(dataSource, 0, 0, resolverUsername, visibleForces)
      expect(isError(initialResolveResult)).toBeFalsy()
      expect(initialResolveResult as boolean).toBeTruthy()

      // Try to resolve again as a different user
      const result = await resolveTrigger(dataSource, 0, 0, reResolverUsername, visibleForces)

      expect(isError(result)).toBeFalsy()
      expect(result as boolean).toBeFalsy()

      const retrievedTrigger = await dataSource
        .getRepository(Trigger)
        .findOne({ where: { triggerId: trigger.triggerId } })
      expect(retrievedTrigger).not.toBeNull()
      const updatedTrigger = retrievedTrigger as Trigger

      expect(updatedTrigger.resolvedAt).not.toBeNull()
      expect(updatedTrigger.resolvedBy).not.toBeNull()
      expect(updatedTrigger.resolvedBy).toStrictEqual(resolverUsername)
    })

    it("Shouldn't resolve a trigger locked by someone else", async () => {
      const resolverUsername = "triggerResolver01"
      const lockHolderUsername = "triggerResolver02"
      const visibleForces = ["36"]

      await insertDummyCourtCaseWithLock(lockHolderUsername, lockHolderUsername, visibleForces)
      const trigger: TestTrigger = {
        triggerId: 0,
        triggerCode: "TRPR0001",
        status: "Unresolved",
        createdAt: new Date("2022-07-12T10:22:34.000Z")
      }
      await insertTriggers(0, [trigger])

      // Attempt to resolve trigger whilst not holding the lock
      const resolveResult = await resolveTrigger(dataSource, 0, 0, resolverUsername, visibleForces)
      expect(isError(resolveResult)).toBeFalsy()
      expect(resolveResult as boolean).toBeFalsy()

      const retrievedTrigger = await dataSource
        .getRepository(Trigger)
        .findOne({ where: { triggerId: trigger.triggerId } })
      expect(retrievedTrigger).not.toBeNull()
      const updatedTrigger = retrievedTrigger as Trigger

      expect(updatedTrigger.resolvedAt).toBeNull()
      expect(updatedTrigger.resolvedBy).toBeNull()
    })

    it("Shouldn't resolve a trigger which is not locked", async () => {
      const resolverUsername = "triggerResolver01"
      const visibleForces = ["36"]

      await insertCourtCasesWithOrgCodes(["01"])
      const trigger: TestTrigger = {
        triggerId: 0,
        triggerCode: "TRPR0001",
        status: "Unresolved",
        createdAt: new Date("2022-07-12T10:22:34.000Z")
      }
      await insertTriggers(0, [trigger])

      // Attempt to resolve trigger whilst not holding the lock
      const resolveResult = await resolveTrigger(dataSource, 0, 0, resolverUsername, visibleForces)
      expect(isError(resolveResult)).toBeFalsy()
      expect(resolveResult as boolean).toBeFalsy()

      const retrievedTrigger = await dataSource
        .getRepository(Trigger)
        .findOne({ where: { triggerId: trigger.triggerId } })
      expect(retrievedTrigger).not.toBeNull()
      const updatedTrigger = retrievedTrigger as Trigger

      expect(updatedTrigger.resolvedAt).toBeNull()
      expect(updatedTrigger.resolvedBy).toBeNull()
    })

    it("Should only set the case trigger columns only when the last trigger is resolved", async () => {
      const resolverUsername = "triggerResolver01"
      const courtCaseId = 0
      const visibleForces = ["36"]

      await insertDummyCourtCaseWithLock(resolverUsername, resolverUsername, visibleForces)
      const triggers: TestTrigger[] = [0, 1, 2].map((triggerId) => {
        return {
          triggerId,
          triggerCode: "TRPR0001",
          status: "Unresolved",
          createdAt: new Date("2022-07-15T10:22:34.000Z")
        }
      })
      await insertTriggers(courtCaseId, triggers)

      const insertedTriggers = await dataSource.getRepository(Trigger).find({ relations: { courtCase: true } })
      expect(insertedTriggers).toHaveLength(3)
      let retrievedCourtCase = await getCourtCase(dataSource, courtCaseId, visibleForces)
      expect(retrievedCourtCase).not.toBeNull()
      let insertedCourtCase = retrievedCourtCase as CourtCase

      expect(insertedCourtCase.triggerStatus).not.toBeNull()
      expect(insertedCourtCase.triggerStatus).toStrictEqual("Unresolved")
      expect(insertedCourtCase.triggerResolvedBy).toBeNull()
      expect(insertedCourtCase.triggerResolvedTimestamp).toBeNull()

      let triggerResolveResult = await resolveTrigger(dataSource, 0, courtCaseId, resolverUsername, visibleForces)
      expect(isError(triggerResolveResult)).toBeFalsy()
      expect(triggerResolveResult as boolean).toBeTruthy()

      retrievedCourtCase = await getCourtCase(dataSource, courtCaseId, ["36"])
      expect(retrievedCourtCase).not.toBeNull()
      insertedCourtCase = retrievedCourtCase as CourtCase
      expect(insertedCourtCase.triggerStatus).not.toBeNull()
      expect(insertedCourtCase.triggerStatus).toStrictEqual("Unresolved")
      expect(insertedCourtCase.triggerResolvedBy).toBeNull()
      expect(insertedCourtCase.triggerResolvedTimestamp).toBeNull()

      triggerResolveResult = await resolveTrigger(dataSource, 1, courtCaseId, resolverUsername, visibleForces)
      expect(isError(triggerResolveResult)).toBeFalsy()
      expect(triggerResolveResult as boolean).toBeTruthy()

      retrievedCourtCase = await getCourtCase(dataSource, courtCaseId, ["36"])
      expect(retrievedCourtCase).not.toBeNull()
      insertedCourtCase = retrievedCourtCase as CourtCase
      expect(insertedCourtCase.triggerStatus).not.toBeNull()
      expect(insertedCourtCase.triggerStatus).toStrictEqual("Unresolved")
      expect(insertedCourtCase.triggerResolvedBy).toBeNull()
      expect(insertedCourtCase.triggerResolvedTimestamp).toBeNull()

      triggerResolveResult = await resolveTrigger(dataSource, 2, courtCaseId, resolverUsername, visibleForces)
      expect(isError(triggerResolveResult)).toBeFalsy()
      expect(triggerResolveResult as boolean).toBeTruthy()

      retrievedCourtCase = await getCourtCase(dataSource, courtCaseId, ["36"])
      expect(retrievedCourtCase).not.toBeNull()
      insertedCourtCase = retrievedCourtCase as CourtCase
      expect(insertedCourtCase.triggerStatus).not.toBeNull()
      expect(insertedCourtCase.triggerStatus).toStrictEqual("Resolved")
      expect(insertedCourtCase.triggerResolvedBy).toStrictEqual(resolverUsername)
      expect(insertedCourtCase.triggerResolvedTimestamp).not.toBeNull()
    })
  })
})

import { expect } from "@jest/globals"
import { differenceInMinutes } from "date-fns"
import { DataSource } from "typeorm"
import { isError } from "types/Result"
import CourtCase from "../../src/services/entities/CourtCase"
import Trigger from "../../src/services/entities/Trigger"
import getCourtCase from "../../src/services/getCourtCase"
import getDataSource from "../../src/services/getDataSource"
import markTriggerComplete from "../../src/services/markTriggerComplete"
import deleteFromTable from "../util/deleteFromTable"
import { insertDummyCourtCaseWithLock } from "../util/insertCourtCases"
import { insertTriggers, TestTrigger } from "../util/manageTriggers"

jest.setTimeout(100000)

describe("listCourtCases", () => {
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

  describe("Mark trigger as complete", () => {
    it("Should set the resolvedAt and resolvedBy columns when marking as complete", async () => {
      const resolverUsername = "triggerResolver01"

      await insertDummyCourtCaseWithLock(resolverUsername, resolverUsername, ["36"])
      const trigger: TestTrigger = {
        triggerId: 0,
        triggerCode: "TRPR0001",
        status: 0,
        createdAt: new Date("2022-07-12T10:22:34.000Z")
      }
      await insertTriggers(0, [trigger])

      const result = await markTriggerComplete(dataSource, 0, 0, resolverUsername)

      expect(isError(result)).toBeFalsy()
      expect(result as boolean).toBeTruthy()

      const retrievedTrigger = await dataSource
        .getRepository(Trigger)
        .findOne({ where: { triggerId: trigger.triggerId } })
      expect(retrievedTrigger).not.toBeNull()
      const updatedTrigger = retrievedTrigger as Trigger

      expect(updatedTrigger.resolvedAt).toBeDefined()
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const minsSinceResolved = differenceInMinutes(new Date(), updatedTrigger.resolvedAt!)
      expect(minsSinceResolved).toBeLessThanOrEqual(5)

      expect(updatedTrigger.resolvedBy).toBeDefined()
      expect(updatedTrigger.resolvedBy).toStrictEqual(resolverUsername)
    })

    it("Shouldn't overwrite an already resolved trigger when attempting to resolve again", async () => {
      const resolverUsername = "triggerResolver01"
      const reResolverUsername = "triggerResolver02"

      await insertDummyCourtCaseWithLock(resolverUsername, resolverUsername, ["36"])
      const trigger: TestTrigger = {
        triggerId: 0,
        triggerCode: "TRPR0001",
        status: 0,
        createdAt: new Date("2022-07-12T10:22:34.000Z")
      }
      await insertTriggers(0, [trigger])

      // Resolve trigger
      const initialResolveResult = await markTriggerComplete(dataSource, 0, 0, resolverUsername)
      expect(isError(initialResolveResult)).toBeFalsy()
      expect(initialResolveResult as boolean).toBeTruthy()

      // Try to resolve again as a different user
      const result = await markTriggerComplete(dataSource, 0, 0, reResolverUsername)

      expect(isError(result)).toBeFalsy()
      expect(result as boolean).toBeFalsy()

      const retrievedTrigger = await dataSource
        .getRepository(Trigger)
        .findOne({ where: { triggerId: trigger.triggerId } })
      expect(retrievedTrigger).not.toBeNull()
      const updatedTrigger = retrievedTrigger as Trigger

      expect(updatedTrigger.resolvedAt).toBeDefined()
      expect(updatedTrigger.resolvedBy).toBeDefined()
      expect(updatedTrigger.resolvedBy).toStrictEqual(resolverUsername)
    })

    it("Should set the case trigger columns only when the last trigger is resolved", async () => {
      const resolverUsername = "triggerResolver01"
      const courtCaseId = 0

      await insertDummyCourtCaseWithLock(resolverUsername, resolverUsername, ["36"])
      const triggers: TestTrigger[] = [0, 1, 2].map((triggerId) => {
        return {
          triggerId,
          triggerCode: "TRPR0001",
          status: 0,
          createdAt: new Date("2022-07-15T10:22:34.000Z")
        }
      })
      await insertTriggers(courtCaseId, triggers)

      const insertedTriggers = await dataSource.getRepository(Trigger).find({ relations: { courtCase: true } })
      expect(insertedTriggers).toHaveLength(3)
      let retrievedCourtCase = await getCourtCase(dataSource, courtCaseId, ["36"])
      expect(retrievedCourtCase).not.toBeNull()
      let insertedCourtCase = retrievedCourtCase as CourtCase

      expect(insertedCourtCase.triggerStatus).toBeDefined()
      expect(insertedCourtCase.triggerStatus).toStrictEqual("Unresolved")
      expect(insertedCourtCase.triggerResolvedBy).toBeNull()
      expect(insertedCourtCase.triggerResolvedTimestamp).toBeNull()

      let triggerResolveResult = await markTriggerComplete(dataSource, 0, courtCaseId, resolverUsername)
      expect(isError(triggerResolveResult)).toBeFalsy()
      expect(triggerResolveResult as boolean).toBeTruthy()

      retrievedCourtCase = await getCourtCase(dataSource, courtCaseId, ["36"])
      expect(retrievedCourtCase).not.toBeNull()
      insertedCourtCase = retrievedCourtCase as CourtCase
      expect(insertedCourtCase.triggerStatus).toBeDefined()
      expect(insertedCourtCase.triggerStatus).toStrictEqual("Unresolved")
      expect(insertedCourtCase.triggerResolvedBy).toBeNull()
      expect(insertedCourtCase.triggerResolvedTimestamp).toBeNull()

      triggerResolveResult = await markTriggerComplete(dataSource, 1, courtCaseId, resolverUsername)
      expect(isError(triggerResolveResult)).toBeFalsy()
      expect(triggerResolveResult as boolean).toBeTruthy()

      retrievedCourtCase = await getCourtCase(dataSource, courtCaseId, ["36"])
      expect(retrievedCourtCase).not.toBeNull()
      insertedCourtCase = retrievedCourtCase as CourtCase
      expect(insertedCourtCase.triggerStatus).toBeDefined()
      expect(insertedCourtCase.triggerStatus).toStrictEqual("Unresolved")
      expect(insertedCourtCase.triggerResolvedBy).toBeNull()
      expect(insertedCourtCase.triggerResolvedTimestamp).toBeNull()

      triggerResolveResult = await markTriggerComplete(dataSource, 2, courtCaseId, resolverUsername)
      expect(isError(triggerResolveResult)).toBeFalsy()
      expect(triggerResolveResult as boolean).toBeTruthy()

      retrievedCourtCase = await getCourtCase(dataSource, courtCaseId, ["36"])
      expect(retrievedCourtCase).not.toBeNull()
      insertedCourtCase = retrievedCourtCase as CourtCase
      expect(insertedCourtCase.triggerStatus).toBeDefined()
      expect(insertedCourtCase.triggerStatus).toStrictEqual("Resolved")
      expect(insertedCourtCase.triggerResolvedBy).toStrictEqual(resolverUsername)
      expect(insertedCourtCase.triggerResolvedTimestamp).not.toBeNull()
    })
  })
})

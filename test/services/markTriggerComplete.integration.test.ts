import { expect } from "@jest/globals"
import { differenceInMinutes } from "date-fns"
import "reflect-metadata"
import markTriggerComplete from "../../src/services/markTriggerComplete"
import { DataSource } from "typeorm"
import { isError } from "types/Result"
import CourtCase from "../../src/services/entities/CourtCase"
import Trigger from "../../src/services/entities/Trigger"
import getDataSource from "../../src/services/getDataSource"
import deleteFromTable from "../testFixtures/database/deleteFromTable"
import { insertCourtCasesWithOrgCodes } from "../testFixtures/database/insertCourtCases"
import { insertTriggers, TestTrigger } from "../testFixtures/database/manageTriggers"

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

      await insertCourtCasesWithOrgCodes(["36"])
      const trigger: TestTrigger = {
        triggerId: 0,
        triggerCode: "TRPR0001",
        status: 0,
        createdAt: new Date("2022-07-12T10:22:34.000Z")
      }
      await insertTriggers(0, [trigger])
      let retrievedTrigger = await dataSource
        .getRepository(Trigger)
        .findOne({ where: { triggerId: trigger.triggerId } })
      expect(retrievedTrigger).not.toBeNull()
      const insertedTrigger = retrievedTrigger as Trigger

      const result = await markTriggerComplete(dataSource, insertedTrigger, resolverUsername)

      expect(isError(result)).toBeFalsy()
      expect(result as boolean).toBeTruthy()

      retrievedTrigger = await dataSource.getRepository(Trigger).findOne({ where: { triggerId: trigger.triggerId } })
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

      await insertCourtCasesWithOrgCodes(["36"])
      const trigger: TestTrigger = {
        triggerId: 0,
        triggerCode: "TRPR0001",
        status: 0,
        createdAt: new Date("2022-07-12T10:22:34.000Z")
      }
      await insertTriggers(0, [trigger])
      let retrievedTrigger = await dataSource
        .getRepository(Trigger)
        .findOne({ where: { triggerId: trigger.triggerId } })
      expect(retrievedTrigger).not.toBeNull()
      const insertedTrigger = retrievedTrigger as Trigger

      // Resolve trigger
      const initialResolveResult = await markTriggerComplete(dataSource, insertedTrigger, resolverUsername)
      expect(isError(initialResolveResult)).toBeFalsy()
      expect(initialResolveResult as boolean).toBeTruthy()

      // Try to resolve again as a different user
      const result = await markTriggerComplete(dataSource, insertedTrigger, reResolverUsername)

      expect(isError(result)).toBeFalsy()
      expect(result as boolean).toBeFalsy()

      retrievedTrigger = await dataSource.getRepository(Trigger).findOne({ where: { triggerId: trigger.triggerId } })
      expect(retrievedTrigger).not.toBeNull()
      const updatedTrigger = retrievedTrigger as Trigger

      expect(updatedTrigger.resolvedAt).toBeDefined()
      expect(updatedTrigger.resolvedBy).toBeDefined()
      expect(updatedTrigger.resolvedBy).toStrictEqual(resolverUsername)
    })
  })
})

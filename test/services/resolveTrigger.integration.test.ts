import { differenceInMinutes } from "date-fns"
import User from "services/entities/User"
import { DataSource } from "typeorm"
import { isError } from "types/Result"
import CourtCase from "../../src/services/entities/CourtCase"
import Trigger from "../../src/services/entities/Trigger"
import getCourtCaseByOrganisationUnit from "../../src/services/getCourtCaseByOrganisationUnit"
import getDataSource from "../../src/services/getDataSource"
import resolveTrigger from "../../src/services/resolveTrigger"
import deleteFromEntity from "../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"
import { insertTriggers, TestTrigger } from "../utils/manageTriggers"

jest.setTimeout(100000)

describe("resolveTrigger", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  describe("Mark trigger as resolved", () => {
    it("Should set the relevant columns when resolving a trigger", async () => {
      const resolverUsername = "triggerResolver01"
      const visibleForce = "36"
      const user = {
        visibleCourts: [],
        visibleForces: [visibleForce],
        username: resolverUsername
      } as Partial<User> as User

      await insertCourtCasesWithFields([
        {
          errorLockedByUsername: resolverUsername,
          triggerLockedByUsername: resolverUsername,
          orgForPoliceFilter: visibleForce
        }
      ])

      const trigger: TestTrigger = {
        triggerId: 0,
        triggerCode: "TRPR0001",
        status: "Unresolved",
        createdAt: new Date("2022-07-12T10:22:34.000Z")
      }
      await insertTriggers(0, [trigger])

      const beforeCourtCaseResult = await getCourtCaseByOrganisationUnit(dataSource, 0, user)
      expect(isError(beforeCourtCaseResult)).toBeFalsy()
      expect(beforeCourtCaseResult).not.toBeNull()
      const beforeCourtCase = beforeCourtCaseResult as CourtCase
      expect(beforeCourtCase.triggerResolvedBy).toBeNull()
      expect(beforeCourtCase.triggerResolvedTimestamp).toBeNull()

      const result = await resolveTrigger(dataSource, 0, 0, user)

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

      const afterCourtCaseResult = await getCourtCaseByOrganisationUnit(dataSource, 0, user)
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

    it("Should set resolution_ts when there are no other unresolved triggers or exceptions", async () => {
      const resolverUsername = "triggerResolver01"
      const visibleForce = "36"
      const user = {
        visibleCourts: [],
        visibleForces: [visibleForce],
        username: resolverUsername
      } as Partial<User> as User

      await insertCourtCasesWithFields([
        {
          errorLockedByUsername: resolverUsername,
          triggerLockedByUsername: resolverUsername,
          orgForPoliceFilter: visibleForce
        }
      ])

      const trigger: TestTrigger = {
        triggerId: 0,
        triggerCode: "TRPR0001",
        status: "Unresolved",
        createdAt: new Date("2022-07-12T10:22:34.000Z")
      }
      await insertTriggers(0, [trigger])

      const beforeCourtCaseResult = await getCourtCaseByOrganisationUnit(dataSource, 0, user)
      const beforeCourtCase = beforeCourtCaseResult as CourtCase
      expect(beforeCourtCase.resolutionTimestamp).toBeNull()
      expect(beforeCourtCase.triggerStatus).toBe("Unresolved")
      await resolveTrigger(dataSource, 0, 0, user)
      const result = await getCourtCaseByOrganisationUnit(dataSource, 0, user)
      const afterCourtCaseResult = result as CourtCase
      expect(afterCourtCaseResult.resolutionTimestamp).not.toBeNull()
    })
    it("Should not set resolution_ts when there are other unresolved triggers or exceptions", async () => {
      const resolverUsername = "triggerResolver01"
      const visibleForce = "36"
      const user = {
        visibleCourts: [],
        visibleForces: [visibleForce],
        username: resolverUsername
      } as Partial<User> as User

      await insertCourtCasesWithFields([
        {
          errorLockedByUsername: resolverUsername,
          triggerLockedByUsername: resolverUsername,
          orgForPoliceFilter: visibleForce
        }
      ])

      const trigger: TestTrigger = {
        triggerId: 0,
        triggerCode: "TRPR0001",
        status: "Unresolved",
        createdAt: new Date("2022-07-12T10:22:34.000Z")
      }
      const trigger2: TestTrigger = {
        triggerId: 1,
        triggerCode: "TRPR0002",
        status: "Unresolved",
        createdAt: new Date("2022-07-12T10:22:34.000Z")
      }
      await insertTriggers(0, [trigger, trigger2])

      const beforeCourtCaseResult = await getCourtCaseByOrganisationUnit(dataSource, 0, user)
      const beforeCourtCase = beforeCourtCaseResult as CourtCase
      expect(beforeCourtCase.resolutionTimestamp).toBeNull()
      // expect(beforeCourtCase.triggerStatus).toBe("Unresolved")
      // await resolveTrigger(dataSource, 0, 0, user)
      // const result = await getCourtCaseByOrganisationUnit(dataSource, 0, user)
      // const afterCourtCaseResult = result as CourtCase
      // expect(afterCourtCaseResult.resolutionTimestamp).not.toBeNull()
    })
    // TODO validate whether insert triggers is adding more than 1 trigger onto a case. check on UI
    // continue test

    it("Shouldn't overwrite an already resolved trigger when attempting to resolve again", async () => {
      const resolverUsername = "triggerResolver01"
      const reResolverUsername = "triggerResolver02"
      const visibleForce = "36"
      const resolverUser = {
        visibleCourts: [],
        visibleForces: [visibleForce],
        username: resolverUsername
      } as Partial<User> as User
      const reResolverUser = {
        visibleCourts: [],
        visibleForces: [visibleForce],
        username: reResolverUsername
      } as Partial<User> as User

      await insertCourtCasesWithFields([
        {
          errorLockedByUsername: resolverUsername,
          triggerLockedByUsername: resolverUsername,
          orgForPoliceFilter: visibleForce
        }
      ])

      const trigger: TestTrigger = {
        triggerId: 0,
        triggerCode: "TRPR0001",
        status: "Unresolved",
        createdAt: new Date("2022-07-12T10:22:34.000Z")
      }
      await insertTriggers(0, [trigger])

      // Resolve trigger
      const initialResolveResult = await resolveTrigger(dataSource, 0, 0, resolverUser)
      expect(isError(initialResolveResult)).toBeFalsy()
      expect(initialResolveResult as boolean).toBeTruthy()

      // Try to resolve again as a different user
      const result = await resolveTrigger(dataSource, 0, 0, reResolverUser)

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
      const visibleForce = "36"

      await insertCourtCasesWithFields([
        {
          errorLockedByUsername: lockHolderUsername,
          triggerLockedByUsername: lockHolderUsername,
          orgForPoliceFilter: visibleForce
        }
      ])
      const trigger: TestTrigger = {
        triggerId: 0,
        triggerCode: "TRPR0001",
        status: "Unresolved",
        createdAt: new Date("2022-07-12T10:22:34.000Z")
      }
      await insertTriggers(0, [trigger])

      // Attempt to resolve trigger whilst not holding the lock
      const resolveResult = await resolveTrigger(dataSource, 0, 0, {
        visibleCourts: [],
        visibleForces: [visibleForce],
        username: resolverUsername
      } as Partial<User> as User)
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

      await insertCourtCasesWithFields([{ orgForPoliceFilter: "01" }])
      const trigger: TestTrigger = {
        triggerId: 0,
        triggerCode: "TRPR0001",
        status: "Unresolved",
        createdAt: new Date("2022-07-12T10:22:34.000Z")
      }
      await insertTriggers(0, [trigger])

      // Attempt to resolve trigger whilst not holding the lock
      const resolveResult = await resolveTrigger(dataSource, 0, 0, {
        visibleCourts: [],
        visibleForces,
        username: resolverUsername
      } as Partial<User> as User)
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
      const visibleForce = "36"
      const user = {
        visibleCourts: [],
        visibleForces: [visibleForce],
        username: resolverUsername
      } as Partial<User> as User

      await insertCourtCasesWithFields([
        {
          errorLockedByUsername: resolverUsername,
          triggerLockedByUsername: resolverUsername,
          orgForPoliceFilter: visibleForce
        }
      ])
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
      let retrievedCourtCase = await getCourtCaseByOrganisationUnit(dataSource, courtCaseId, user)
      expect(retrievedCourtCase).not.toBeNull()
      let insertedCourtCase = retrievedCourtCase as CourtCase

      expect(insertedCourtCase.triggerStatus).not.toBeNull()
      expect(insertedCourtCase.triggerStatus).toStrictEqual("Unresolved")
      expect(insertedCourtCase.triggerResolvedBy).toBeNull()
      expect(insertedCourtCase.triggerResolvedTimestamp).toBeNull()

      let triggerResolveResult = await resolveTrigger(dataSource, 0, courtCaseId, user)
      expect(isError(triggerResolveResult)).toBeFalsy()
      expect(triggerResolveResult as boolean).toBeTruthy()

      retrievedCourtCase = await getCourtCaseByOrganisationUnit(dataSource, courtCaseId, user)
      expect(retrievedCourtCase).not.toBeNull()
      insertedCourtCase = retrievedCourtCase as CourtCase
      expect(insertedCourtCase.triggerStatus).not.toBeNull()
      expect(insertedCourtCase.triggerStatus).toStrictEqual("Unresolved")
      expect(insertedCourtCase.triggerResolvedBy).toBeNull()
      expect(insertedCourtCase.triggerResolvedTimestamp).toBeNull()

      triggerResolveResult = await resolveTrigger(dataSource, 1, courtCaseId, user)
      expect(isError(triggerResolveResult)).toBeFalsy()
      expect(triggerResolveResult as boolean).toBeTruthy()

      retrievedCourtCase = await getCourtCaseByOrganisationUnit(dataSource, courtCaseId, user)
      expect(retrievedCourtCase).not.toBeNull()
      insertedCourtCase = retrievedCourtCase as CourtCase
      expect(insertedCourtCase.triggerStatus).not.toBeNull()
      expect(insertedCourtCase.triggerStatus).toStrictEqual("Unresolved")
      expect(insertedCourtCase.triggerResolvedBy).toBeNull()
      expect(insertedCourtCase.triggerResolvedTimestamp).toBeNull()

      triggerResolveResult = await resolveTrigger(dataSource, 2, courtCaseId, user)
      expect(isError(triggerResolveResult)).toBeFalsy()
      expect(triggerResolveResult as boolean).toBeTruthy()

      retrievedCourtCase = await getCourtCaseByOrganisationUnit(dataSource, courtCaseId, user)
      expect(retrievedCourtCase).not.toBeNull()
      insertedCourtCase = retrievedCourtCase as CourtCase
      expect(insertedCourtCase.triggerStatus).not.toBeNull()
      expect(insertedCourtCase.triggerStatus).toStrictEqual("Resolved")
      expect(insertedCourtCase.triggerResolvedBy).toStrictEqual(resolverUsername)
      expect(insertedCourtCase.triggerResolvedTimestamp).not.toBeNull()
    })
  })
})

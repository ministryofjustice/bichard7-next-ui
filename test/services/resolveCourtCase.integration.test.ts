import User from "services/entities/User"
import { DataSource } from "typeorm"
import { isError } from "types/Result"
import CourtCase from "../../src/services/entities/CourtCase"
import getCourtCaseByOrganisationUnit from "../../src/services/getCourtCaseByOrganisationUnit"
import getDataSource from "../../src/services/getDataSource"
import resolveCourtCase from "../../src/services/resolveCourtCase"
import deleteFromEntity from "../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"
import { differenceInMilliseconds } from "date-fns"
import { ManualResolution } from "types/ManualResolution"
import { TestTrigger, insertTriggers } from "../utils/manageTriggers"

jest.setTimeout(100000)

describe("resolveCourtCase", () => {
  let dataSource: DataSource
  const visibleForce = "36"
  const resolverUsername = "Resolver User"
  const user = {
    visibleCourts: [],
    visibleForces: [visibleForce],
    username: resolverUsername,
    canLockExceptions: true,
    canLockTriggers: true
  } as Partial<User> as User

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  describe("When there aren't any unresolved triggers", () => {
    beforeEach(async () => {
      await insertCourtCasesWithFields([
        {
          errorLockedByUsername: resolverUsername,
          triggerLockedByUsername: resolverUsername,
          orgForPoliceFilter: visibleForce
        }
      ])
    })

    it("Should resolve a case and populate a resolutionTimestamp", async () => {
      const resolution: ManualResolution = {
        reason: "NonRecordable"
      }

      const beforeCourtCaseResult = await getCourtCaseByOrganisationUnit(dataSource, 0, user)
      expect(isError(beforeCourtCaseResult)).toBeFalsy()
      expect(beforeCourtCaseResult).not.toBeNull()
      const beforeCourtCase = beforeCourtCaseResult as CourtCase
      expect(beforeCourtCase.errorStatus).toEqual("Unresolved")
      expect(beforeCourtCase.errorLockedByUsername).toEqual(resolverUsername)
      expect(beforeCourtCase.triggerLockedByUsername).toEqual(resolverUsername)
      expect(beforeCourtCase.errorResolvedBy).toBeNull()
      expect(beforeCourtCase.errorResolvedTimestamp).toBeNull()
      expect(beforeCourtCase.resolutionTimestamp).toBeNull()

      const result = await resolveCourtCase(dataSource, 0, resolution, user)

      expect(isError(result)).toBeFalsy()

      const afterCourtCaseResult = await getCourtCaseByOrganisationUnit(dataSource, 0, user)
      expect(isError(afterCourtCaseResult)).toBeFalsy()
      expect(afterCourtCaseResult).not.toBeNull()
      const afterCourtCase = afterCourtCaseResult as CourtCase

      // Resolves the error
      expect(afterCourtCase.errorStatus).toEqual("Resolved")
      // Unlocks the case
      expect(afterCourtCase.errorLockedByUsername).toBeNull()
      expect(afterCourtCase.triggerLockedByUsername).toBeNull()
      // Sets resolver user
      expect(afterCourtCase.errorResolvedBy).toEqual(resolverUsername)

      // Sets the timestamps
      expect(afterCourtCase.errorResolvedTimestamp).not.toBeNull()
      expect(afterCourtCase.resolutionTimestamp).not.toBeNull()
      // When there are no unresolved triggers the resolution time stamp also set
      expect(afterCourtCase.errorResolvedTimestamp).toEqual(afterCourtCase.resolutionTimestamp)

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const timeSinceCaseTriggersResolved = differenceInMilliseconds(new Date(), afterCourtCase.errorResolvedTimestamp!)
      expect(timeSinceCaseTriggersResolved).toBeGreaterThanOrEqual(0)

      // Creates a system note
      expect(afterCourtCase.notes[0].userId).toEqual("System")
      expect(afterCourtCase.notes[0].noteText).toEqual(
        `${resolverUsername}: Portal Action: Record Manually Resolved.` +
          ` Reason: ${resolution.reason}. Reason Text: ${resolution.reasonText}`
      )
    })
  })

  describe("When there are unresolved triggers", () => {
    beforeEach(async () => {
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
    })

    it("Should resolve a case without a resolutionTimestamp", async () => {
      const resolution: ManualResolution = {
        reason: "NonRecordable"
      }

      const result = await resolveCourtCase(dataSource, 0, resolution, user)

      expect(isError(result)).toBeFalsy()

      const afterCourtCaseResult = await getCourtCaseByOrganisationUnit(dataSource, 0, user)
      expect(isError(afterCourtCaseResult)).toBeFalsy()
      expect(afterCourtCaseResult).not.toBeNull()
      const afterCourtCase = afterCourtCaseResult as CourtCase

      expect(afterCourtCase.errorStatus).toEqual("Resolved")
      expect(afterCourtCase.errorLockedByUsername).toBeNull()
      expect(afterCourtCase.triggerLockedByUsername).toBeNull()
      expect(afterCourtCase.errorResolvedBy).toEqual(resolverUsername)
      expect(afterCourtCase.errorResolvedTimestamp).not.toBeNull()
      expect(afterCourtCase.notes[0].userId).toEqual("System")
      expect(afterCourtCase.notes[0].noteText).toEqual(
        `${resolverUsername}: Portal Action: Record Manually Resolved.` +
          ` Reason: ${resolution.reason}. Reason Text: ${resolution.reasonText}`
      )

      expect(afterCourtCase.resolutionTimestamp).toBeNull()
    })
  })
})

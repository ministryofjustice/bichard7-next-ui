import User from "services/entities/User"
import { DataSource, UpdateQueryBuilder, UpdateResult } from "typeorm"
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
import insertNotes from "services/insertNotes"
import unlockCourtCase from "services/unlockCourtCase"
import courtCasesByOrganisationUnitQuery from "services/queries/courtCasesByOrganisationUnitQuery"

jest.setTimeout(100000)
jest.mock("services/insertNotes")
jest.mock("services/unlockCourtCase")
jest.mock("services/queries/courtCasesByOrganisationUnitQuery")

const expectToBeUnresolved = (courtCase: CourtCase) => {
  expect(courtCase.errorStatus).toEqual("Unresolved")
  expect(courtCase.errorLockedByUsername).not.toBeNull()
  expect(courtCase.triggerLockedByUsername).not.toBeNull()
  expect(courtCase.errorResolvedBy).toBeNull()
  expect(courtCase.errorResolvedTimestamp).toBeNull()
  expect(courtCase.resolutionTimestamp).toBeNull()
  expect(courtCase.errorResolvedTimestamp).toBeNull()
  expect(courtCase.notes).toHaveLength(0)
}

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
    jest.resetAllMocks()
    jest.clearAllMocks()
    ;(insertNotes as jest.Mock).mockImplementation(jest.requireActual("services/insertNotes").default)
    ;(unlockCourtCase as jest.Mock).mockImplementation(jest.requireActual("services/unlockCourtCase").default)
    ;(courtCasesByOrganisationUnitQuery as jest.Mock).mockImplementation(
      jest.requireActual("services/queries/courtCasesByOrganisationUnitQuery").default
    )
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it("should call cases by organisation unit query", async () => {
    await resolveCourtCase(
      dataSource,
      0,
      {
        reason: "NonRecordable"
      },
      user
    )

    expect(courtCasesByOrganisationUnitQuery).toHaveBeenCalledTimes(1)
    expect(courtCasesByOrganisationUnitQuery).toHaveBeenCalledWith(expect.any(Object), user)
  })

  describe("When there aren't any unresolved triggers", () => {
    it("Should resolve a case and populate a resolutionTimestamp", async () => {
      await insertCourtCasesWithFields([
        {
          errorLockedByUsername: resolverUsername,
          triggerLockedByUsername: resolverUsername,
          orgForPoliceFilter: visibleForce,
          errorStatus: "Unresolved",
          errorCount: 4
        }
      ])

      const resolution: ManualResolution = {
        reason: "NonRecordable",
        reasonText: "Some description"
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

    it("Should only resolve the case that matches the case id", async () => {
      const firstCaseId = 0
      const secondCaseId = 1
      await insertCourtCasesWithFields([
        {
          errorId: firstCaseId,
          errorLockedByUsername: resolverUsername,
          triggerLockedByUsername: resolverUsername,
          orgForPoliceFilter: visibleForce,
          errorStatus: "Unresolved",
          errorCount: 1
        },
        {
          errorId: secondCaseId,
          errorLockedByUsername: resolverUsername,
          triggerLockedByUsername: resolverUsername,
          orgForPoliceFilter: visibleForce,
          errorStatus: "Unresolved",
          errorCount: 1
        }
      ])

      const resolution: ManualResolution = {
        reason: "NonRecordable"
      }

      const result = await resolveCourtCase(dataSource, firstCaseId, resolution, user)
      expect(isError(result)).toBeFalsy()

      const records = await dataSource
        .getRepository(CourtCase)
        .createQueryBuilder("courtCase")
        .orderBy("courtCase.errorId")
        .getMany()
        .catch((error: Error) => error)
      const courtCases = records as CourtCase[]

      expect(courtCases[0].errorId).toEqual(firstCaseId)
      expect(courtCases[0].errorStatus).toEqual("Resolved")

      expect(courtCases[1].errorId).toEqual(secondCaseId)
      expect(courtCases[1].errorStatus).toEqual("Unresolved")
    })

    it("Should only resolve the case that matches the organisation unit", async () => {
      const caseId = 0
      await insertCourtCasesWithFields([
        {
          errorId: caseId,
          errorLockedByUsername: resolverUsername,
          triggerLockedByUsername: resolverUsername,
          orgForPoliceFilter: "3LSE",
          errorStatus: "Unresolved",
          errorCount: 1
        }
      ])

      const resolution: ManualResolution = {
        reason: "NonRecordable"
      }

      const result = await resolveCourtCase(dataSource, caseId, resolution, user)
      expect((result as Error).message).toEqual("Failed to resolve case")

      const records = await dataSource
        .getRepository(CourtCase)
        .createQueryBuilder("courtCase")
        .getMany()
        .catch((error: Error) => error)
      const courtCases = records as CourtCase[]

      expect(courtCases).toHaveLength(1)
      expect(courtCases[0].errorId).toEqual(caseId)
      expect(courtCases[0].errorStatus).toEqual("Unresolved")
    })

    it("Should not resolve a case when the case is locked by another user", async () => {
      const anotherUser = "Another User"
      await insertCourtCasesWithFields([
        {
          errorLockedByUsername: anotherUser,
          triggerLockedByUsername: anotherUser,
          orgForPoliceFilter: visibleForce,
          errorStatus: "Unresolved",
          errorCount: 1
        }
      ])

      const resolution: ManualResolution = {
        reason: "NonRecordable"
      }

      const result = await resolveCourtCase(dataSource, 0, resolution, user)
      expect(isError(result)).toBeTruthy()
      expect((result as Error).message).toEqual("Failed to resolve case")

      const afterCourtCaseResult = await getCourtCaseByOrganisationUnit(dataSource, 0, user)
      expect(isError(afterCourtCaseResult)).toBeFalsy()
      expect(afterCourtCaseResult).not.toBeNull()
      const afterCourtCase = afterCourtCaseResult as CourtCase

      expectToBeUnresolved(afterCourtCase)
    })

    it("Should not resolve a case when the case is not locked", async () => {
      await insertCourtCasesWithFields([
        {
          errorLockedByUsername: null,
          triggerLockedByUsername: null,
          orgForPoliceFilter: visibleForce,
          errorStatus: "Unresolved",
          errorCount: 1
        }
      ])

      const resolution: ManualResolution = {
        reason: "NonRecordable"
      }

      const result = await resolveCourtCase(dataSource, 0, resolution, user)
      expect(isError(result)).toBeTruthy()
      expect((result as Error).message).toEqual("Failed to resolve case")

      const afterCourtCaseResult = await getCourtCaseByOrganisationUnit(dataSource, 0, user)
      expect(isError(afterCourtCaseResult)).toBeFalsy()
      expect(afterCourtCaseResult).not.toBeNull()
      const afterCourtCase = afterCourtCaseResult as CourtCase

      expect(afterCourtCase.errorStatus).toEqual("Unresolved")
    })

    it("Should return the error when the resolution reason is 'Reallocated' but reasonText is not provided", async () => {
      await insertCourtCasesWithFields([
        {
          errorLockedByUsername: resolverUsername,
          triggerLockedByUsername: resolverUsername,
          orgForPoliceFilter: visibleForce,
          errorStatus: "Unresolved",
          errorCount: 1
        }
      ])

      let result = await resolveCourtCase(
        dataSource,
        0,
        {
          reason: "Reallocated",
          reasonText: undefined
        },
        user
      )
      expect(isError(result)).toBeTruthy()
      expect((result as Error).message).toEqual("Reason text is required")

      result = await resolveCourtCase(
        dataSource,
        0,
        {
          reason: "Reallocated",
          reasonText: "Text provided"
        },
        user
      )
      expect(isError(result)).toBeFalsy()
    })
  })

  describe("When there are unresolved triggers", () => {
    beforeEach(async () => {
      await insertCourtCasesWithFields([
        {
          errorLockedByUsername: resolverUsername,
          triggerLockedByUsername: resolverUsername,
          orgForPoliceFilter: visibleForce,
          errorStatus: "Unresolved",
          errorCount: 1
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

    it("Should resolve a case without setting a resolutionTimestamp", async () => {
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

  describe("When there are triggers but no errors on a case", () => {
    beforeEach(async () => {
      await insertCourtCasesWithFields([
        {
          errorLockedByUsername: resolverUsername,
          triggerLockedByUsername: resolverUsername,
          errorStatus: null,
          errorCount: 0,
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

    it("Should not resolve the case", async () => {
      const resolution: ManualResolution = {
        reason: "NonRecordable"
      }

      const result = await resolveCourtCase(dataSource, 0, resolution, user)

      expect(isError(result)).toBeTruthy()

      const afterCourtCaseResult = await getCourtCaseByOrganisationUnit(dataSource, 0, user)
      expect(isError(afterCourtCaseResult)).toBeFalsy()
      expect(afterCourtCaseResult).not.toBeNull()
      const afterCourtCase = afterCourtCaseResult as CourtCase

      expect(afterCourtCase.errorStatus).toBeUndefined()
      expect(afterCourtCase.errorLockedByUsername).toEqual(resolverUsername)
      expect(afterCourtCase.triggerLockedByUsername).toEqual(resolverUsername)
      expect(afterCourtCase.errorResolvedBy).toBeNull()
      expect(afterCourtCase.errorResolvedTimestamp).toBeNull()
      expect(afterCourtCase.resolutionTimestamp).toBeNull()
      expect(afterCourtCase.errorResolvedTimestamp).toBeNull()
      expect(afterCourtCase.notes).toHaveLength(0)
    })
  })

  describe("when there is an unexpected error", () => {
    const resolution: ManualResolution = {
      reason: "NonRecordable"
    }

    beforeEach(async () => {
      await insertCourtCasesWithFields([
        {
          errorLockedByUsername: resolverUsername,
          triggerLockedByUsername: resolverUsername,
          orgForPoliceFilter: visibleForce,
          errorStatus: "Unresolved",
          errorCount: 1
        }
      ])
    })

    it("should return the error if fails to create notes", async () => {
      ;(insertNotes as jest.Mock).mockImplementationOnce(() => new Error(`Error while creating notes`))

      let result: UpdateResult | Error
      try {
        result = await resolveCourtCase(dataSource, 0, resolution, user)
      } catch (error) {
        result = error as Error
      }
      expect(result).toEqual(Error(`Error while creating notes`))

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: 0 } })
      const actualCourtCase = record as CourtCase

      expectToBeUnresolved(actualCourtCase)
    })

    it("should return the error if fails to unlock the case", async () => {
      ;(unlockCourtCase as jest.Mock).mockImplementationOnce(() => new Error(`Error while unlocking the case`))

      let result: UpdateResult | Error
      try {
        result = await resolveCourtCase(dataSource, 0, resolution, user)
      } catch (error) {
        result = error as Error
      }

      expect(result).toEqual(Error(`Error while unlocking the case`))

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: 0 } })
      const actualCourtCase = record as CourtCase

      expectToBeUnresolved(actualCourtCase)
    })

    it("should return the error when fails to update the case", async () => {
      jest
        .spyOn(UpdateQueryBuilder.prototype, "execute")
        .mockRejectedValue(Error("Failed to update record with some error"))

      let result: UpdateResult | Error
      try {
        result = await resolveCourtCase(dataSource, 0, resolution, user)
      } catch (error) {
        result = error as Error
      }
      expect(result).toEqual(Error(`Failed to update record with some error`))

      const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: 0 } })
      const actualCourtCase = record as CourtCase

      expectToBeUnresolved(actualCourtCase)
    })
  })
})

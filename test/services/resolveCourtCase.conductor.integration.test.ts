/* eslint-disable import/first */
process.env.LEGACY_PHASE1 = "false"

import { continueConductorWorkflow } from "services/conductor"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import getDataSource from "services/getDataSource"
import resolveCourtCase from "services/resolveCourtCase"
import { DataSource } from "typeorm"
import { ManualResolution } from "types/ManualResolution"
import { hasAccessToAll } from "../helpers/hasAccessTo"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"

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

jest.setTimeout(100000)
jest.mock("services/conductor/continueConductorWorkflow")

describe("", () => {
  let dataSource: DataSource
  const visibleForce = "36"
  const resolverUsername = "Resolver User"
  const user = {
    visibleCourts: [],
    visibleForces: [visibleForce],
    username: resolverUsername,
    hasAccessTo: hasAccessToAll
  } as Partial<User> as User
  let courtCases: CourtCase[] = []
  const resolution: ManualResolution = {
    reason: "NonRecordable"
  }

  beforeAll(async () => {
    dataSource = await getDataSource()
    jest.resetAllMocks()
    jest.clearAllMocks()
  })

  beforeEach(async () => {
    courtCases = await insertCourtCasesWithFields([
      {
        errorLockedByUsername: resolverUsername,
        triggerLockedByUsername: resolverUsername,
        orgForPoliceFilter: visibleForce,
        errorStatus: "Unresolved",
        errorCount: 1
      }
    ])
  })

  it("Should return the error if fails to update conductor workflow", async () => {
    const expectedError = `Error updating conductor workflow`
    ;(continueConductorWorkflow as jest.Mock).mockImplementationOnce(() => new Error(expectedError))

    const result = await resolveCourtCase(dataSource, courtCases[0], resolution, user).catch((error) => error as Error)

    expect(result).toEqual(Error(expectedError))

    const record = await dataSource.getRepository(CourtCase).findOne({ where: { errorId: 0 } })
    const actualCourtCase = record as CourtCase

    expectToBeUnresolved(actualCourtCase)
  })
})

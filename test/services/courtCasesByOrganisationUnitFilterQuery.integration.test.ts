import CourtCase from "services/entities/CourtCase"
import getDataSource from "services/getDataSource"
import { DataSource, Repository, SelectQueryBuilder, UpdateQueryBuilder } from "typeorm"
import deleteFromEntity from "../utils/deleteFromEntity"
import courtCasesByVisibleCourtsQuery from "services/queries/courtCasesByVisibleCourtsQuery"
import courtCasesByVisibleForcesQuery from "../../src/services/queries/courtCasesByVisibleForcesQuery"
import courtCasesByOrganisationUnitQuery from "services/queries/courtCasesByOrganisationUnitQuery"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"
import { isError } from "types/Result"
import User from "services/entities/User"

jest.mock("services/queries/courtCasesByVisibleCourtsQuery")
jest.mock("services/queries/courtCasesByVisibleForcesQuery")

describe("courtCasesByOrganisationUnitQuery", () => {
  let dataSource: DataSource
  let repository: Repository<CourtCase>
  let query: SelectQueryBuilder<CourtCase>

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
    jest.resetAllMocks()
    jest.clearAllMocks()
    ;(courtCasesByVisibleCourtsQuery as jest.Mock).mockImplementation(
      jest.requireActual("services/queries/courtCasesByVisibleCourtsQuery").default
    )
    ;(courtCasesByVisibleForcesQuery as jest.Mock).mockImplementation(
      jest.requireActual("services/queries/courtCasesByVisibleForcesQuery").default
    )
    repository = dataSource.getRepository(CourtCase)
    query = repository.createQueryBuilder("courtCase")
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  it("should call both visible courts and visible forces queries", async () => {
    const dummyCode = "dummyForceCode"
    const user: Partial<User> = {
      visibleForces: [dummyCode],
      visibleCourts: [dummyCode]
    }

    courtCasesByOrganisationUnitQuery(query, user as User)

    expect(courtCasesByVisibleCourtsQuery).toHaveBeenCalledTimes(1)
    expect(courtCasesByVisibleCourtsQuery).toHaveBeenCalledWith(expect.any(Object), [dummyCode])

    expect(courtCasesByVisibleForcesQuery).toHaveBeenCalledTimes(1)
    expect(courtCasesByVisibleForcesQuery).toHaveBeenCalledWith(expect.any(Object), [dummyCode])
  })

  it("should select all visible cases when its a select query", async () => {
    const expectedOrgCodes = ["12GHA ", "12GHAB", "13BR  ", "14AT  "]
    const otherOrgCodes = ["15AA", "16AA"]
    const user: Partial<User> = {
      visibleForces: ["12GHA"],
      visibleCourts: ["13BR", "14AT"]
    }
    await insertCourtCasesWithFields(
      expectedOrgCodes.concat(otherOrgCodes).map((orgCode) => ({ orgForPoliceFilter: orgCode }))
    )

    const result = await (courtCasesByOrganisationUnitQuery(query, user as User) as SelectQueryBuilder<CourtCase>)
      .getMany()
      .catch((error: Error) => error)

    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]
    expect(cases).toHaveLength(4)
    expect(cases.map((c) => c.orgForPoliceFilter)).toEqual(expect.arrayContaining(expectedOrgCodes))
  })

  it("should update visible cases when its an update query", async () => {
    const expectedOrgCodes = ["12GHA ", "12GHAB", "13BR  "]
    const otherOrgCodes = ["14AT  ", "15AA", "16AA"]
    const user: Partial<User> = {
      visibleForces: ["12GHA"],
      visibleCourts: ["13BR"]
    }
    await insertCourtCasesWithFields(
      expectedOrgCodes.concat(otherOrgCodes).map((orgCode) => ({ orgForPoliceFilter: orgCode }))
    )

    const updateQuery = query.update(CourtCase)

    const result = await (courtCasesByOrganisationUnitQuery(updateQuery, user as User) as UpdateQueryBuilder<CourtCase>)
      .set({
        errorLockedByUsername: "DummyUser"
      })
      .execute()

    expect(isError(result)).toBe(false)
    expect(result.affected).toBe(3)
  })
})

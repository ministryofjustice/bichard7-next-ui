import CourtCase from "services/entities/CourtCase"
import getDataSource from "services/getDataSource"
import { DataSource, Repository, SelectQueryBuilder, UpdateQueryBuilder } from "typeorm"
import { isError } from "types/Result"
import courtCasesByVisibleForcesQuery from "../../src/services/queries/courtCasesByVisibleForcesQuery"
import deleteFromEntity from "../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"

describe("courtCaseByVisibleForcesQuery", () => {
  let dataSource: DataSource
  let repository: Repository<CourtCase>
  let query: SelectQueryBuilder<CourtCase>

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
    repository = dataSource.getRepository(CourtCase)
    query = repository.createQueryBuilder("courtCase")
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  it("Should show cases for all forces visible to a user", async () => {
    const orgCodesForAllVisibleForces = ["36", "36FPA1", "12LK", "12GHAB", "12GH", "13GH", "13GHA"]

    await insertCourtCasesWithFields(orgCodesForAllVisibleForces.map((orgCode) => ({ orgForPoliceFilter: orgCode })))

    const result = await (courtCasesByVisibleForcesQuery(query, [36, 13]) as SelectQueryBuilder<CourtCase>)
      .getMany()
      .catch((error: Error) => error)

    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(4)

    expect(cases.map((c) => c.orgForPoliceFilter)).toEqual(
      expect.arrayContaining(["36    ", "36FPA1", "13GH  ", "13GHA "])
    )
    expect(cases.map((c) => c.errorId)).toEqual(expect.arrayContaining([0, 1, 5, 6]))
  })

  it("Should show no cases to a user with no visible forces", async () => {
    const orgCodesForNoVisibleCases = ["36", "36F"]
    await insertCourtCasesWithFields(orgCodesForNoVisibleCases.map((orgCode) => ({ orgForPoliceFilter: orgCode })))

    const result = await (courtCasesByVisibleForcesQuery(query, []) as SelectQueryBuilder<CourtCase>)
      .getMany()
      .catch((error: Error) => error)

    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(0)
  })

  it("Should update visible cases when its an update query", async () => {
    const orgCodesForVisibleForceLen5 = ["12GH", "12LK", "12G", "12GHB", "12GHA", "12GHAB", "12GHAC", "13BR", "14AT"]
    await insertCourtCasesWithFields(orgCodesForVisibleForceLen5.map((orgCode) => ({ orgForPoliceFilter: orgCode })))

    const updateQuery = query.update(CourtCase)

    const result = await (courtCasesByVisibleForcesQuery(updateQuery, [12]) as UpdateQueryBuilder<CourtCase>)
      .set({
        errorLockedByUsername: "DummyUser"
      })
      .execute()

    expect(isError(result)).toBe(false)
    expect(result.affected).toBe(7)
  })
})

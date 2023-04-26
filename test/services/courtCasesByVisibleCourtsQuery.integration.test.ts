import CourtCase from "services/entities/CourtCase"
import getDataSource from "services/getDataSource"
import courtCasesByVisibleCourtsQuery from "services/queries/courtCasesByVisibleCourtsQuery"
import { DataSource, Repository, SelectQueryBuilder, UpdateQueryBuilder } from "typeorm"
import { isError } from "types/Result"
import deleteFromEntity from "../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"

describe("courtCasesByVisibleCourtsQuery", () => {
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

  it("should return a list of cases when the court code is an exact match", async () => {
    const orgCodes = ["3", "36", "36AAAA"]
    await insertCourtCasesWithFields(orgCodes.map((orgCode) => ({ orgForPoliceFilter: orgCode })))

    const result = await (courtCasesByVisibleCourtsQuery(query, ["36AAAA"]) as SelectQueryBuilder<CourtCase>)
      .getMany()
      .catch((error: Error) => error)

    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(1)
    expect(cases[0].errorId).toEqual(2)
    expect(cases[0].orgForPoliceFilter).toEqual("36AAAA")
  })

  it("should show cases for all courts visible to a user where the beginning of the code matches", async () => {
    const orgCodesForVisibleCourts = ["36F   ", "36FP  ", "13GH  ", "13GHA "]
    const otherOrgCodes = ["36", "13", "12LK"]

    await insertCourtCasesWithFields(
      orgCodesForVisibleCourts.concat(otherOrgCodes).map((orgCode) => ({ orgForPoliceFilter: orgCode }))
    )

    const result = await (courtCasesByVisibleCourtsQuery(query, ["36F", "13GH"]) as SelectQueryBuilder<CourtCase>)
      .getMany()
      .catch((error: Error) => error)

    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(4)

    expect(cases.map((c) => c.orgForPoliceFilter)).toEqual(expect.arrayContaining(orgCodesForVisibleCourts))
    expect(cases.map((c) => c.errorId)).toEqual(expect.arrayContaining([0, 1, 2, 3]))
  })

  it("should show no cases to a user with no visible courts", async () => {
    const orgCodesForNoVisibleCases = ["36", "36F", "36FP", "36FPA"]
    await insertCourtCasesWithFields(orgCodesForNoVisibleCases.map((orgCode) => ({ orgForPoliceFilter: orgCode })))

    const result = await (courtCasesByVisibleCourtsQuery(query, []) as SelectQueryBuilder<CourtCase>)
      .getMany()
      .catch((error: Error) => error)

    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(0)
  })

  it("should update visible cases when its an update query", async () => {
    const orgCodesForVisibleCourts = ["013", "013A", "013B", "014"]
    await insertCourtCasesWithFields(orgCodesForVisibleCourts.map((orgCode) => ({ orgForPoliceFilter: orgCode })))

    const updateQuery = query.update(CourtCase)

    const result = await (courtCasesByVisibleCourtsQuery(updateQuery, ["013"]) as UpdateQueryBuilder<CourtCase>)
      .set({
        errorLockedByUsername: "DummyUser"
      })
      .execute()

    expect(isError(result)).toBe(false)
    expect(result.affected).toBe(3)
  })
})

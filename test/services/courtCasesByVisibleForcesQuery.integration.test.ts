import CourtCase from "services/entities/CourtCase"
import getDataSource from "services/getDataSource"
import { DataSource, Repository, SelectQueryBuilder, UpdateQueryBuilder } from "typeorm"
import { isError } from "types/Result"
import deleteFromTable from "../utils/deleteFromTable"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"
import courtCasesByVisibleForcesQuery from "../../src/services/queries/courtCasesByVisibleForcesQuery"

const orgCodes = ["36", "36F", "36FP", "36FPA", "36FPA1", "36FQ", "12LK", "12G", "12GHB", "12GHA", "12GHAB", "12GHAC"]

describe("courtCaseByVisibleForcesQuery", () => {
  let dataSource: DataSource
  let repository: Repository<CourtCase>
  let query: SelectQueryBuilder<CourtCase>

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromTable(CourtCase)
    repository = dataSource.getRepository(CourtCase)
    query = repository.createQueryBuilder("courtCase")
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  it("should return a list of cases when the force code length is 1", async () => {
    const orgCodesForceCodeLen1 = [
      "3",
      "36",
      "36F",
      "36FP",
      "36FPA",
      "36FPA1",
      "36FQ",
      "37F",
      "12LK",
      "12G",
      "12GHB",
      "12GHA",
      "12GHAB",
      "12GHAC"
    ]
    await insertCourtCasesWithFields(orgCodesForceCodeLen1.map((orgCode) => ({ orgForPoliceFilter: orgCode })))

    const result = await (courtCasesByVisibleForcesQuery(query, ["3"]) as SelectQueryBuilder<CourtCase>)
      .getMany()
      .catch((error: Error) => error)

    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(8)
    expect(cases.map((c) => c.orgForPoliceFilter)).toEqual(
      expect.arrayContaining(["3     ", "36    ", "36F   ", "36FP  ", "36FPA ", "36FPA1", "36FQ  ", "37F   "])
    )
    expect(cases.map((c) => c.errorId)).toEqual(expect.arrayContaining([0, 1, 2, 3, 4, 5, 6, 7]))
  })

  it("should return a list of cases when the force code length is 2", async () => {
    await insertCourtCasesWithFields(orgCodes.map((orgCode) => ({ orgForPoliceFilter: orgCode })))

    const result = await (courtCasesByVisibleForcesQuery(query, ["36"]) as SelectQueryBuilder<CourtCase>)
      .getMany()
      .catch((error: Error) => error)

    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(6)
    expect(cases.map((c) => c.orgForPoliceFilter)).toEqual(
      expect.arrayContaining(["36    ", "36F   ", "36FP  ", "36FPA ", "36FPA1", "36FQ  "])
    )
    expect(cases.map((c) => c.errorId)).toEqual(expect.arrayContaining([0, 1, 2, 3, 4, 5]))
  })

  it("should return a list of cases when the force code length is 3", async () => {
    await insertCourtCasesWithFields(orgCodes.map((orgCode) => ({ orgForPoliceFilter: orgCode })))

    const result = await (courtCasesByVisibleForcesQuery(query, ["36F"]) as SelectQueryBuilder<CourtCase>)
      .getMany()
      .catch((error: Error) => error)

    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(5)
    expect(cases.map((c) => c.orgForPoliceFilter)).toEqual(
      expect.arrayContaining(["36F   ", "36FP  ", "36FPA ", "36FPA1", "36FQ  "])
    )
    expect(cases.map((c) => c.errorId)).toEqual(expect.arrayContaining([1, 2, 3, 4, 5]))
  })

  it("should return a list of cases when the force code length is 4", async () => {
    await insertCourtCasesWithFields(orgCodes.map((orgCode) => ({ orgForPoliceFilter: orgCode })))

    const result = await (courtCasesByVisibleForcesQuery(query, ["36FP"]) as SelectQueryBuilder<CourtCase>)
      .getMany()
      .catch((error: Error) => error)

    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(3)
    expect(cases.map((c) => c.orgForPoliceFilter)).toEqual(expect.arrayContaining(["36FP  ", "36FPA ", "36FPA1"]))
    expect(cases.map((c) => c.errorId)).toEqual(expect.arrayContaining([2, 3, 4]))
  })

  it("a user with a visible force of length 5 can see cases for the 4-long prefix, and the exact match, and 6-long suffixes of the visible force", async () => {
    const orgCodesForVisibleForceLen5 = ["12GH", "12LK", "12G", "12GHB", "12GHA", "12GHAB", "12GHAC", "13BR", "14AT"]
    await insertCourtCasesWithFields(orgCodesForVisibleForceLen5.map((orgCode) => ({ orgForPoliceFilter: orgCode })))

    const result = await (courtCasesByVisibleForcesQuery(query, ["12GHA"]) as SelectQueryBuilder<CourtCase>)
      .getMany()
      .catch((error: Error) => error)

    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(4)

    expect(cases[0].orgForPoliceFilter).toBe("12GH  ")
    expect(cases[1].orgForPoliceFilter).toBe("12GHA ")
    expect(cases[2].orgForPoliceFilter).toBe("12GHAB")
    expect(cases[3].orgForPoliceFilter).toBe("12GHAC")
  })

  it("shouldn't return non-visible cases when the force code length is 6", async () => {
    const orgCodesForNonVisibleCases = [
      "36",
      "36F",
      "36FP",
      "36FPA",
      "36FPA1",
      "36FPA2",
      "36FQ",
      "12LK",
      "12G",
      "12GHB",
      "12GHA",
      "12GHAB",
      "12GHAC"
    ]
    await insertCourtCasesWithFields(orgCodesForNonVisibleCases.map((orgCode) => ({ orgForPoliceFilter: orgCode })))

    const result = await (courtCasesByVisibleForcesQuery(query, ["36FPA1"]) as SelectQueryBuilder<CourtCase>)
      .getMany()
      .catch((error: Error) => error)

    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(3)

    expect(cases.map((c) => c.orgForPoliceFilter)).toEqual(expect.arrayContaining(["36FP  ", "36FPA ", "36FPA1"]))
    expect(cases.map((c) => c.errorId)).toEqual(expect.arrayContaining([2, 3, 4]))
  })

  it("should show cases for all forces visible to a user", async () => {
    const orgCodesForAllVisibleForces = [
      "36",
      "36F",
      "36FP",
      "36FPA",
      "36FPA1",
      "36FPA2",
      "36FQ",
      "12LK",
      "12G",
      "12GHB",
      "12GHA",
      "12GHAB",
      "12GH",
      "13GH",
      "13GHA",
      "13GHA1",
      "13GHB",
      "13GHBA"
    ]

    await insertCourtCasesWithFields(orgCodesForAllVisibleForces.map((orgCode) => ({ orgForPoliceFilter: orgCode })))

    const result = await (courtCasesByVisibleForcesQuery(query, ["36FPA1", "13GH"]) as SelectQueryBuilder<CourtCase>)
      .getMany()
      .catch((error: Error) => error)

    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(8)

    expect(cases.map((c) => c.orgForPoliceFilter)).toEqual(
      expect.arrayContaining(["36FP  ", "36FPA ", "36FPA1", "13GH  ", "13GHA ", "13GHA1", "13GHB ", "13GHBA"])
    )
    expect(cases.map((c) => c.errorId)).toEqual(expect.arrayContaining([2, 3, 4, 13, 14, 15, 16, 17]))
  })

  it("should show no cases to a user with no visible forces", async () => {
    const orgCodesForNoVisibleCases = [
      "36",
      "36F",
      "36FP",
      "36FPA",
      "36FPA1",
      "36FPA2",
      "36FQ",
      "12LK",
      "12G",
      "12GHB",
      "12GHA",
      "12GHAB",
      "12GH",
      "13GH",
      "13GHA",
      "13GHA1",
      "13GHB",
      "13GHBA"
    ]
    await insertCourtCasesWithFields(orgCodesForNoVisibleCases.map((orgCode) => ({ orgForPoliceFilter: orgCode })))

    const result = await (courtCasesByVisibleForcesQuery(query, []) as SelectQueryBuilder<CourtCase>)
      .getMany()
      .catch((error: Error) => error)

    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(0)
  })

  it("should update visible cases when its an update query", async () => {
    const orgCodesForVisibleForceLen5 = ["12GH", "12LK", "12G", "12GHB", "12GHA", "12GHAB", "12GHAC", "13BR", "14AT"]
    await insertCourtCasesWithFields(orgCodesForVisibleForceLen5.map((orgCode) => ({ orgForPoliceFilter: orgCode })))

    const updateQuery = query.update(CourtCase)

    const result = await (courtCasesByVisibleForcesQuery(updateQuery, ["12GHA"]) as UpdateQueryBuilder<CourtCase>)
      .set({
        errorLockedByUsername: "DummyUser"
      })
      .execute()

    expect(isError(result)).toBe(false)
    expect(result.affected).toBe(4)
  })
})

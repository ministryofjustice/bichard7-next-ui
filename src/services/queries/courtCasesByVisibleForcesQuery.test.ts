import CourtCase from "services/entities/CourtCase"
import getDataSource from "services/getDataSource"
import listCourtCases from "services/listCourtCases"
import { DataSource, Repository, SelectQueryBuilder } from "typeorm"
import { ListCourtCaseResult } from "types/ListCourtCasesResult"
import { isError } from "types/Result"
import deleteFromTable from "../../../test/utils/deleteFromTable"
import { insertCourtCasesWithFields } from "../../../test/utils/insertCourtCases"
import courtCasesByVisibleForcesQuery from "./courtCasesByVisibleForcesQuery"

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

    query = courtCasesByVisibleForcesQuery(query, ["3"]) as SelectQueryBuilder<CourtCase>

    const result = await query.getMany().catch((error: Error) => error)
    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(8)
    expect(cases.map((c) => c.orgForPoliceFilter)).toStrictEqual([
      "3     ",
      "36    ",
      "36F   ",
      "36FP  ",
      "36FPA ",
      "36FPA1",
      "36FQ  ",
      "37F   "
    ])
    expect(cases.map((c) => c.errorId)).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7])
  })

  it.only("should return a list of cases when the force code length is 2", async () => {
    await insertCourtCasesWithFields(orgCodes.map((orgCode) => ({ orgForPoliceFilter: orgCode })))

    const result = await listCourtCases(dataSource, { forces: ["36"], maxPageItems: "10" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(6)
    expect(cases.map((c) => c.orgForPoliceFilter)).toStrictEqual([
      "36    ",
      "36F   ",
      "36FP  ",
      "36FPA ",
      "36FPA1",
      "36FQ  "
    ])
    expect(cases.map((c) => c.errorId)).toStrictEqual([0, 1, 2, 3, 4, 5])
    expect(totalCases).toEqual(6)
  })

  it("should return a list of cases when the force code length is 3", async () => {
    await insertCourtCasesWithFields(orgCodes.map((orgCode) => ({ orgForPoliceFilter: orgCode })))

    const result = await listCourtCases(dataSource, { forces: ["36F"], maxPageItems: "10" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(5)
    expect(cases.map((c) => c.orgForPoliceFilter)).toStrictEqual(["36F   ", "36FP  ", "36FPA ", "36FPA1", "36FQ  "])
    expect(cases.map((c) => c.errorId)).toStrictEqual([1, 2, 3, 4, 5])
    expect(totalCases).toEqual(5)
  })

  it("should return a list of cases when the force code length is 4", async () => {
    await insertCourtCasesWithFields(orgCodes.map((orgCode) => ({ orgForPoliceFilter: orgCode })))

    const result = await listCourtCases(dataSource, { forces: ["36FP"], maxPageItems: "10" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(3)
    expect(cases.map((c) => c.orgForPoliceFilter)).toStrictEqual(["36FP  ", "36FPA ", "36FPA1"])
    expect(cases.map((c) => c.errorId)).toStrictEqual([2, 3, 4])
    expect(totalCases).toEqual(3)
  })

  it("a user with a visible force of length 5 can see cases for the 4-long prefix, and the exact match, and 6-long suffixes of the visible force", async () => {
    const orgCodesForVisibleForceLen5 = ["12GH", "12LK", "12G", "12GHB", "12GHA", "12GHAB", "12GHAC", "13BR", "14AT"]
    await insertCourtCasesWithFields(orgCodesForVisibleForceLen5.map((orgCode) => ({ orgForPoliceFilter: orgCode })))

    const result = await listCourtCases(dataSource, { forces: ["12GHA"], maxPageItems: "10" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(4)

    expect(cases[0].orgForPoliceFilter).toBe("12GH  ")
    expect(cases[1].orgForPoliceFilter).toBe("12GHA ")
    expect(cases[2].orgForPoliceFilter).toBe("12GHAB")
    expect(cases[3].orgForPoliceFilter).toBe("12GHAC")
    expect(totalCases).toEqual(4)
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

    const result = await listCourtCases(dataSource, { forces: ["36FPA1"], maxPageItems: "10" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(3)

    expect(cases.map((c) => c.orgForPoliceFilter)).toStrictEqual(["36FP  ", "36FPA ", "36FPA1"])
    expect(cases.map((c) => c.errorId)).toStrictEqual([2, 3, 4])
    expect(totalCases).toEqual(3)
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

    const result = await listCourtCases(dataSource, { forces: ["36FPA1", "13GH"], maxPageItems: "100" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(8)

    expect(cases.map((c) => c.orgForPoliceFilter)).toStrictEqual([
      "36FP  ",
      "36FPA ",
      "36FPA1",
      "13GH  ",
      "13GHA ",
      "13GHA1",
      "13GHB ",
      "13GHBA"
    ])
    expect(cases.map((c) => c.errorId)).toStrictEqual([2, 3, 4, 13, 14, 15, 16, 17])
    expect(totalCases).toEqual(8)
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

    const result = await listCourtCases(dataSource, { forces: [], maxPageItems: "100" })
    expect(isError(result)).toBe(false)
    const { result: cases, totalCases } = result as ListCourtCaseResult

    expect(cases).toHaveLength(0)
    expect(totalCases).toEqual(0)
  })
})

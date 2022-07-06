/* eslint-disable @typescript-eslint/naming-convention */
import "reflect-metadata"
import { expect } from "@jest/globals"
import listCourtCases from "../../src/useCases/listCourtCases"
import deleteFromTable from "../testFixtures/database/deleteFromTable"
import CourtCaseCase from "../testFixtures/database/data/error_list.json"
import insertCourtCases from "../testFixtures/database/insertCourtCases"
import { isError } from "../../src/types/Result"
import CourtCase from "../../src/entities/CourtCase"
import { DataSource } from "typeorm"
import getDataSource from "../../src/lib/getDataSource"

const insertRecords = (orgsCodes: string[]) => {
  const existingCourtCases = orgsCodes.map((code, i) => {
    return {
      ...CourtCaseCase,
      org_for_police_filter: code.padEnd(6, " "),
      error_id: i,
      message_id: String(i).padStart(5, "x")
    }
  })

  return insertCourtCases(existingCourtCases)
}

describe("listCourtCases", () => {
  let connection: DataSource

  beforeAll(async () => {
    connection = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromTable(CourtCase)
  })

  afterAll(async () => {
    await connection.destroy()
  })

  it("shouldn't return more cases than the specified limit", async () => {
    await insertRecords(Array.from(Array(100)).map(() => "36FPA1"))

    const result = await listCourtCases(connection, ["036FPA1"], 10)
    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(10)

    expect(cases[0].errorId).toBe(0)
    expect(cases[9].errorId).toBe(9)
    expect(cases[0].messageId).toBe("xxxx0")
    expect(cases[9].messageId).toBe("xxxx9")
  })

  it("should return a list of cases when the force code length is 1", async () => {
    await insertRecords([
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
    ])

    const result = await listCourtCases(connection, ["03"], 100)
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

  it("should return a list of cases when the force code length is 2", async () => {
    await insertRecords([
      "36",
      "36F",
      "36FP",
      "36FPA",
      "36FPA1",
      "36FQ",
      "12LK",
      "12G",
      "12GHB",
      "12GHA",
      "12GHAB",
      "12GHAC"
    ])

    const result = await listCourtCases(connection, ["036"], 100)
    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

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
  })

  it("should return a list of cases when the force code length is 3", async () => {
    await insertRecords([
      "36",
      "36F",
      "36FP",
      "36FPA",
      "36FPA1",
      "36FQ",
      "12LK",
      "12G",
      "12GHB",
      "12GHA",
      "12GHAB",
      "12GHAC"
    ])

    const result = await listCourtCases(connection, ["036F"], 100)
    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(5)
    expect(cases.map((c) => c.orgForPoliceFilter)).toStrictEqual(["36F   ", "36FP  ", "36FPA ", "36FPA1", "36FQ  "])
    expect(cases.map((c) => c.errorId)).toStrictEqual([1, 2, 3, 4, 5])
  })

  it("should return a list of cases when the force code length is 4", async () => {
    await insertRecords([
      "36",
      "36F",
      "36FP",
      "36FPA",
      "36FPA1",
      "36FQ",
      "12LK",
      "12G",
      "12GHB",
      "12GHA",
      "12GHAB",
      "12GHAC"
    ])

    const result = await listCourtCases(connection, ["036FP"], 100)
    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(3)
    expect(cases.map((c) => c.orgForPoliceFilter)).toStrictEqual(["36FP  ", "36FPA ", "36FPA1"])
    expect(cases.map((c) => c.errorId)).toStrictEqual([2, 3, 4])
  })

  it("a user with a visible force of length 5 can see cases for the 4-long prefix, and the exact match, and 6-long suffixes of the visible force", async () => {
    await insertRecords(["12GH", "12LK", "12G", "12GHB", "12GHA", "12GHAB", "12GHAC", "13BR", "14AT"])

    const result = await listCourtCases(connection, ["012GHA"], 100)
    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(4)

    expect(cases[0].orgForPoliceFilter).toBe("12GH  ")
    expect(cases[1].orgForPoliceFilter).toBe("12GHA ")
    expect(cases[2].orgForPoliceFilter).toBe("12GHAB")
    expect(cases[3].orgForPoliceFilter).toBe("12GHAC")
  })

  it("shouldn't return non-visible cases when the force code length is 6", async () => {
    await insertRecords([
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
    ])

    const result = await listCourtCases(connection, ["036FPA1"], 100)
    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(3)

    expect(cases.map((c) => c.orgForPoliceFilter)).toStrictEqual(["36FP  ", "36FPA ", "36FPA1"])
    expect(cases.map((c) => c.errorId)).toStrictEqual([2, 3, 4])
  })

  it("should show cases for all forces visible to a user", async () => {
    await insertRecords([
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
    ])

    const result = await listCourtCases(connection, ["036FPA1", "013GH"], 100)
    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

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
  })

  it("should show no cases to a user with no visible forces", async () => {
    await insertRecords([
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
    ])

    const result = await listCourtCases(connection, [], 100)
    expect(isError(result)).toBe(false)
    const cases = result as CourtCase[]

    expect(cases).toHaveLength(0)
  })
})

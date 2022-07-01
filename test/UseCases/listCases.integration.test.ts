/* eslint-disable @typescript-eslint/naming-convention */
import Database from "../../src/types/Database"
import getTestConnection from "../testFixtures/getTestConnection"
import listCases from "../../src/useCases/listCases"
import deleteFromTable from "../testFixtures/database/deleteFromTable"
import errorListCase from "../testFixtures/database/data/error_list.json"
import insertIntoErrorListTable from "../testFixtures/database/insertIntoErrorListTable"
import { isError } from "../../src/types/Result"

const insertRecords = (orgsCodes: string[]) => {
  const existingCases = orgsCodes.map((code, i) => {
    return {
      ...errorListCase,
      org_for_police_filter: code.padEnd(6, " "),
      error_id: i,
      message_id: String(i).padStart(5, "x")
    }
  })

  return insertIntoErrorListTable(existingCases)
}

describe("listCases", () => {
  let connection: Database

  beforeAll(() => {
    connection = getTestConnection()
  })

  beforeEach(async () => {
    await deleteFromTable("error_list")
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("shouldn't return more cases than the specified limit", async () => {
    await insertRecords(Array.from(Array(100)).map(() => "36FPA1"))

    const cases = await listCases(connection, ["036FPA1"], 10)
    expect(isError(cases)).toBe(false)

    expect(cases).toHaveLength(10)

    expect(cases[0].error_id).toBe(0)
    expect(cases[9].error_id).toBe(9)
    expect(cases[0].message_id).toBe("xxxx0")
    expect(cases[9].message_id).toBe("xxxx9")
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

    const cases = await listCases(connection, ["03"], 100)
    expect(isError(cases)).toBe(false)

    expect(cases).toHaveLength(8)
    expect(cases.map((c) => c.org_for_police_filter)).toStrictEqual([
      "3     ",
      "36    ",
      "36F   ",
      "36FP  ",
      "36FPA ",
      "36FPA1",
      "36FQ  ",
      "37F   "
    ])
    expect(cases.map((c) => c.error_id)).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7])
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

    const cases = await listCases(connection, ["036"], 100)
    expect(isError(cases)).toBe(false)

    expect(cases).toHaveLength(6)
    expect(cases.map((c) => c.org_for_police_filter)).toStrictEqual([
      "36    ",
      "36F   ",
      "36FP  ",
      "36FPA ",
      "36FPA1",
      "36FQ  "
    ])
    expect(cases.map((c) => c.error_id)).toStrictEqual([0, 1, 2, 3, 4, 5])
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

    const cases = await listCases(connection, ["036F"], 100)
    expect(isError(cases)).toBe(false)

    expect(cases).toHaveLength(5)
    expect(cases.map((c) => c.org_for_police_filter)).toStrictEqual(["36F   ", "36FP  ", "36FPA ", "36FPA1", "36FQ  "])
    expect(cases.map((c) => c.error_id)).toStrictEqual([1, 2, 3, 4, 5])
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

    const cases = await listCases(connection, ["036FP"], 100)
    expect(isError(cases)).toBe(false)

    expect(cases).toHaveLength(3)
    expect(cases.map((c) => c.org_for_police_filter)).toStrictEqual(["36FP  ", "36FPA ", "36FPA1"])
    expect(cases.map((c) => c.error_id)).toStrictEqual([2, 3, 4])
  })

  it("a user with a visible force of length 5 can see cases for the 4-long prefix, and the exact match, and 6-long suffixes of the visible force", async () => {
    await insertRecords(["12GH", "12LK", "12G", "12GHB", "12GHA", "12GHAB", "12GHAC", "13BR", "14AT"])

    const cases = await listCases(connection, ["012GHA"], 100)
    expect(isError(cases)).toBe(false)

    expect(cases).toHaveLength(4)

    expect(cases[0].org_for_police_filter).toBe("12GH  ")
    expect(cases[1].org_for_police_filter).toBe("12GHA ")
    expect(cases[2].org_for_police_filter).toBe("12GHAB")
    expect(cases[3].org_for_police_filter).toBe("12GHAC")
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

    const cases = await listCases(connection, ["036FPA1"], 100)
    expect(isError(cases)).toBe(false)

    expect(cases).toHaveLength(3)

    expect(cases.map((c) => c.org_for_police_filter)).toStrictEqual(["36FP  ", "36FPA ", "36FPA1"])
    expect(cases.map((c) => c.error_id)).toStrictEqual([2, 3, 4])
  })
})

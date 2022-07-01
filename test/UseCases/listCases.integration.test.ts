/* eslint-disable @typescript-eslint/naming-convention */
import Database from "../../src/types/Database"
import getTestConnection from "../testFixtures/getTestConnection"
import listCases from "../../src/useCases/listCases"
import deleteFromTable from "../testFixtures/database/deleteFromTable"
import errorListCase from "../testFixtures/database/data/error_list.json"
import insertIntoErrorListTable from "../testFixtures/database/insertIntoErrorListTable"
import { isError } from "../../src/types/Result"

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

  it("should return a list of cases when the force code length is 1", async () => {
    const existingCases = Array.from(Array(100)).map((_x, i) => {
      return {
        ...errorListCase,
        org_for_police_filter: "36FP  ",
        error_id: i,
        message_id: String(i).padStart(5, "x")
      }
    })

    await insertIntoErrorListTable(existingCases)

    const cases = await listCases(connection, ["03"], 100)

    expect(isError(cases)).toBe(false)

    expect(cases).toHaveLength(100)

    expect(cases[0].error_id).toBe(0)
    expect(cases[99].error_id).toBe(99)
    expect(cases[0].message_id).toBe("xxxx0")
    expect(cases[99].message_id).toBe("xxx99")
  })

  it("should return a list of cases when the force code length is 2", async () => {
    const existingCases = Array.from(Array(100)).map((_x, i) => {
      return {
        ...errorListCase,
        org_for_police_filter: "36FP  ",
        error_id: i,
        message_id: String(i).padStart(5, "x")
      }
    })

    await insertIntoErrorListTable(existingCases)

    const cases = await listCases(connection, ["036"], 100)

    expect(isError(cases)).toBe(false)

    expect(cases).toHaveLength(100)

    expect(cases[0].error_id).toBe(0)
    expect(cases[99].error_id).toBe(99)
    expect(cases[0].message_id).toBe("xxxx0")
    expect(cases[99].message_id).toBe("xxx99")
  })

  it("should return a list of cases when the force code length is 3", async () => {
    const existingCases = Array.from(Array(100)).map((_x, i) => {
      return {
        ...errorListCase,
        org_for_police_filter: "36FP  ",
        error_id: i,
        message_id: String(i).padStart(5, "x")
      }
    })

    await insertIntoErrorListTable(existingCases)

    const cases = await listCases(connection, ["036F"], 100)

    expect(isError(cases)).toBe(false)

    expect(cases).toHaveLength(100)

    expect(cases[0].error_id).toBe(0)
    expect(cases[99].error_id).toBe(99)
    expect(cases[0].message_id).toBe("xxxx0")
    expect(cases[99].message_id).toBe("xxx99")
  })

  it("should return a list of cases when the force code length is 4", async () => {
    const existingCases = Array.from(Array(100)).map((_, i) => {
      return {
        ...errorListCase,
        org_for_police_filter: "36FP  ",
        error_id: i,
        message_id: String(i).padStart(5, "x")
      }
    })

    await insertIntoErrorListTable(existingCases)

    const cases = await listCases(connection, ["036FP"], 100)
    expect(isError(cases)).toBe(false)

    expect(cases).toHaveLength(100)

    expect(cases[0].error_id).toBe(0)
    expect(cases[99].error_id).toBe(99)
    expect(cases[0].message_id).toBe("xxxx0")
    expect(cases[99].message_id).toBe("xxx99")
  })

  it("shouldn't return non-visible cases when the force code length is 6", async () => {
    const orgsCodes = ["36", "36F", "36FP", "36FPA", "36FPA1", "12LK", "12G", "12GHB", "12GHA", "12GHAB", "12GHAC"]
    const existingCases = orgsCodes.map((code, i) => {
      return {
        ...errorListCase,
        org_for_police_filter: code.padEnd(6, " "),
        error_id: i,
        message_id: String(i).padStart(5, "x")
      }
    })

    await insertIntoErrorListTable(existingCases)

    const cases = await listCases(connection, ["036FPA1"], 100)
    expect(isError(cases)).toBe(false)

    expect(cases).toHaveLength(3)

    expect(cases.map((c) => c.org_for_police_filter)).toStrictEqual(["36FP  ", "36FPA ", "36FPA1"])
    expect(cases.map((c) => c.error_id)).toStrictEqual([2, 3, 4])
  })

  it("shouldn't return more cases than the specified limit", async () => {
    const existingCases = Array.from(Array(100)).map((_x, i) => {
      return {
        ...errorListCase,
        org_for_police_filter: "36FPA1",
        error_id: i,
        message_id: String(i).padStart(5, "x")
      }
    })

    await insertIntoErrorListTable(existingCases)

    const cases = await listCases(connection, ["036FPA1"], 10)
    expect(isError(cases)).toBe(false)

    expect(cases).toHaveLength(10)

    expect(cases[0].error_id).toBe(0)
    expect(cases[9].error_id).toBe(9)
    expect(cases[0].message_id).toBe("xxxx0")
    expect(cases[9].message_id).toBe("xxxx9")
  })

  it("a user with a visible force of length 4 can see cases where the org filter starts with the visible force", async () => {
    const orgsCodes = ["12GH", "12LK", "12G", "12GHAB", "13BR", "14AT"]
    const existingCases = orgsCodes.map((code, i) => {
      return {
        ...errorListCase,
        org_for_police_filter: code.padEnd(6, " "),
        error_id: i,
        message_id: String(i).padStart(5, "x")
      }
    })

    await insertIntoErrorListTable(existingCases)

    const cases = await listCases(connection, ["012GH"], 100)
    expect(isError(cases)).toBe(false)

    expect(cases).toHaveLength(2)

    expect(cases[0].message_id).toBe("xxxx0")
    expect(cases[0].org_for_police_filter).toBe("12GH  ")

    expect(cases[1].message_id).toBe("xxxx3")
    expect(cases[1].org_for_police_filter).toBe("12GHAB")
  })

  it("a user with a visible force of length 5 can see cases for the 4-long prefix, and the exact match, and 6-long suffixes of the visible force", async () => {
    const orgsCodes = ["12GH", "12LK", "12G", "12GHB", "12GHA", "12GHAB", "12GHAC", "13BR", "14AT"]
    const existingCases = orgsCodes.map((code, i) => {
      return {
        ...errorListCase,
        org_for_police_filter: code.padEnd(6, " "),
        error_id: i,
        message_id: String(i).padStart(5, "x")
      }
    })

    await insertIntoErrorListTable(existingCases)

    const cases = await listCases(connection, ["012GHA"], 100)
    expect(isError(cases)).toBe(false)

    expect(cases).toHaveLength(4)

    expect(cases[0].org_for_police_filter).toBe("12GH  ")
    expect(cases[1].org_for_police_filter).toBe("12GHA ")
    expect(cases[2].org_for_police_filter).toBe("12GHAB")
    expect(cases[3].org_for_police_filter).toBe("12GHAC")
  })
})

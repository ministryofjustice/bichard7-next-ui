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

  it("should return a list of cases when the force code length is 2", async () => {
    const existingCases = Array.from(Array(100)).map((_x, i) => {
        return {
           ...errorListCase, 
           org_for_police_filter: "36FP  ",
           error_id: i,
           message_id: String(i).padStart(5, 'x')
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

  it("should return a list of cases when the force code length is 1", async () => {
    const existingCases = Array.from(Array(100)).map((_x, i) => {
        return {
           ...errorListCase, 
           org_for_police_filter: "36FP  ",
           error_id: i,
           message_id: String(i).padStart(5, 'x')
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

  it("should return a list of cases when the force code length is 4", async () => {
    const existingCases = Array.from(Array(100)).map((_x, i) => {
        return {
           ...errorListCase, 
           org_for_police_filter: "36FP  ",
           error_id: i,
           message_id: String(i).padStart(5, 'x')
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
  
   it("should return a list of cases when the force code length is 6", async () => {
    const existingCases = Array.from(Array(100)).map((_x, i) => {
        return {
           ...errorListCase, 
           org_for_police_filter: "36FPA1",
           error_id: i,
           message_id: String(i).padStart(5, 'x')
        }
    })

    await insertIntoErrorListTable(existingCases)

    const cases = await listCases(connection, ["036FPA1"], 100)
    expect(isError(cases)).toBe(false)

    expect(cases).toHaveLength(100)

    expect(cases[0].error_id).toBe(0)
    expect(cases[99].error_id).toBe(99)
    expect(cases[0].message_id).toBe("xxxx0")
    expect(cases[99].message_id).toBe("xxx99")
  })

   it("should only return cases visible to this user", async () => {
    const existingCases = Array.from(Array(100)).map((_x, i) => {
        return {
           ...errorListCase, 
           org_for_police_filter: i.toString().padStart(2, "0"),
           error_id: i,
           message_id: String(i).padStart(5, 'x')
        }
    })

    await insertIntoErrorListTable(existingCases)

    const cases = await listCases(connection, ["012"], 100)
    expect(isError(cases)).toBe(false)

    expect(cases).toHaveLength(1)

    expect(cases[0].error_id).toBe(12)
    expect(cases[0].message_id).toBe("xxx12")
    expect(cases[0].org_for_police_filter).toBe("12    ")
    
  })

})

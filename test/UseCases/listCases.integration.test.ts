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

  it("should return a list of cases when cases exists in the database", async () => {
    const existingCases = Array.from(Array(100)).map((_x, i) => {
        return {
           ...errorListCase, 
           error_id: i,
           message_id: String(i).padStart(5, 'x')
        }
    })

    await insertIntoErrorListTable(existingCases)

    const cases = await listCases(connection, 100)

    expect(isError(cases)).toBe(false)

    expect(cases).toHaveLength(100)

    expect(cases[0].error_id).toBe(0)
    expect(cases[99].error_id).toBe(99)
    expect(cases[0].message_id).toBe("xxxx0")
    expect(cases[99].message_id).toBe("xxx99")
  })
})

import Database from "../../src/types/Database"
import getTestConnection from "../testFixtures/getTestConnection"
import listCases from "../../src/useCases/listCases"

describe("listCases", () => {
  let connection: Database

  beforeAll(() => {
    connection = getTestConnection()
  })

  beforeEach(async () => {
    // delete everything from table ?
    // await deleteFromTable("?")
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should return a list of cases when cases exists in the database", async () => {
    // insert cases into db
    const cases = await listCases(connection, 100)

    expect(cases).toHaveLength(36)
  })
})

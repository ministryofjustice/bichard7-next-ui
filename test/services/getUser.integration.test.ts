import { expect } from "@jest/globals"
import { DataSource } from "typeorm"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import getCourtCase from "../../src/services/getCourtCase"
import { isError } from "../../src/types/Result"
import deleteFromTable from "../util/deleteFromTable"
import { getDummyCourtCase, insertCourtCases } from "../util/insertCourtCases"
import User from "services/entities/User"

describe("getUser", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromTable(User)
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  it("should return the user when given a matching username", async () => {
    // Put user in DB
    // Run getUser(username)
    // Assert user is correct
  })

  it("shouldn't return the user when given different username", async () => {
    // Put user in DB
    // Run getUser(username)
    // Assert user is correct
  })

  it("shouldn't return the user when given an empty username", async () => {
    // Put user in DB
    // Run getUser(username)
    // Assert user is correct
  })

  //TODO: Add some extra tests around featureFlag edge cases
})

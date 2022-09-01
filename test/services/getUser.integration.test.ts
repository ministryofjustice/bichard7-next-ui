import { expect } from "@jest/globals"
import { DataSource } from "typeorm"
import getDataSource from "../../src/services/getDataSource"
import { isError } from "../../src/types/Result"
import User from "../../src/services/entities/User"
import { deleteUsers, getDummyUser, insertUsers } from "../util/manageUsers"
import getUser from "../../src/services/getUser"

describe("getUser", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteUsers()
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  it("should return the user when given a matching username", async () => {
    const inputUser = await getDummyUser()
    await insertUsers(inputUser)

    const result = await getUser(dataSource, inputUser.username)
    expect(isError(result)).toBe(false)

    const actualUser = result as User
    expect(actualUser).toStrictEqual(inputUser)
  })

  it("shouldn't return the user when given different username", async () => {
    const inputUser = await getDummyUser()
    await insertUsers(inputUser)

    const result = await getUser(dataSource, "usernameWrong")
    expect(isError(result)).toBe(false)
    expect(result).toBeNull()
  })

  it("shouldn't return the user when given an empty username", async () => {
    const inputUser = await getDummyUser()
    await insertUsers(inputUser)

    const result = await getUser(dataSource, "")
    expect(isError(result)).toBe(false)
    expect(result).toBeNull()
  })

  it("should parse missing feature flags correctly", async () => {
    const inputUser = await getDummyUser({
      featureFlags: {}
    })
    await insertUsers(inputUser)

    const result = await getUser(dataSource, inputUser.username)
    expect(isError(result)).toBe(false)

    const actualUser = result as User
    expect(actualUser).toStrictEqual(inputUser)
  })
})

import { DataSource } from "typeorm"
import getDataSource from "../../src/services/getDataSource"
import { isError } from "../../src/types/Result"
import User from "../../src/services/entities/User"
import { deleteUsers, getDummyUser, insertUsers } from "../utils/manageUsers"
import getUser from "../../src/services/getUser"
import GroupName from "types/GroupName"

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
    const groups = ["B7Supervisor_grp", "B7GeneralHandler_grp"]
    const expectedGroups: GroupName[] = ["Supervisor", "GeneralHandler"]

    const result = await getUser(dataSource, inputUser.username, groups)
    expect(isError(result)).toBe(false)

    const actualUser = result as User
    expect({ ...actualUser }).toStrictEqual({ ...inputUser, groups: expectedGroups })
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

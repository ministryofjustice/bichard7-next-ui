import { expect } from "@jest/globals"
import User from "services/entities/User"
import Permission from "types/Permission"
import { UserGroup } from "types/UserGroup"

const createUser = (...groups: UserGroup[]) => {
  const user = new User()
  user.groups = [...groups]
  user.featureFlags = { exceptionsEnabled: true }

  return user
}

describe("user permissions", () => {
  test("User in only exception handler group", () => {
    const user = createUser(UserGroup.ExceptionHandler)

    expect(user.hasAccessTo[Permission.Exceptions]).toBe(true)
    expect(user.hasAccessTo[Permission.Triggers]).toBe(false)
  })

  test("User in only trigger handler group", () => {
    const user = createUser(UserGroup.TriggerHandler)

    expect(user.hasAccessTo[Permission.Exceptions]).toBe(false)
    expect(user.hasAccessTo[Permission.Triggers]).toBe(true)
  })

  test("User in only general handler group", () => {
    const user = createUser(UserGroup.GeneralHandler)

    expect(user.hasAccessTo[Permission.Exceptions]).toBe(true)
    expect(user.hasAccessTo[Permission.Triggers]).toBe(true)
  })

  test("User in only allocator group", () => {
    const user = createUser(UserGroup.Allocator)

    expect(user.hasAccessTo[Permission.Exceptions]).toBe(true)
    expect(user.hasAccessTo[Permission.Triggers]).toBe(true)
  })

  test("User in only supervisor group", () => {
    const user = createUser(UserGroup.Supervisor)

    expect(user.hasAccessTo[Permission.Exceptions]).toBe(true)
    expect(user.hasAccessTo[Permission.Triggers]).toBe(true)
  })

  test("User in all non-handler groups", () => {
    const user = createUser(
      UserGroup.Audit,
      UserGroup.AuditLoggingManager,
      UserGroup.NewUI,
      UserGroup.SuperUserManager,
      UserGroup.UserManager
    )

    expect(user.hasAccessTo[Permission.Exceptions]).toBe(false)
    expect(user.hasAccessTo[Permission.Triggers]).toBe(false)
  })

  test("User with no groups", () => {
    const user = createUser()

    expect(user.hasAccessTo[Permission.Exceptions]).toBe(false)
    expect(user.hasAccessTo[Permission.Triggers]).toBe(false)
  })
})

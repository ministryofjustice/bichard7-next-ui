import { expect } from "@jest/globals"
import User from "services/entities/User"
import Feature from "types/Feature"
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

    expect(user.hasAccessTo[Feature.Exceptions]).toBe(true)
    expect(user.hasAccessTo[Feature.Triggers]).toBe(false)
  })

  test("User in only trigger handler group", () => {
    const user = createUser(UserGroup.TriggerHandler)

    expect(user.hasAccessTo[Feature.Exceptions]).toBe(false)
    expect(user.hasAccessTo[Feature.Triggers]).toBe(true)
  })

  test("User in only general handler group", () => {
    const user = createUser(UserGroup.GeneralHandler)

    expect(user.hasAccessTo[Feature.Exceptions]).toBe(true)
    expect(user.hasAccessTo[Feature.Triggers]).toBe(true)
  })

  test("User in only allocator group", () => {
    const user = createUser(UserGroup.Allocator)

    expect(user.hasAccessTo[Feature.Exceptions]).toBe(true)
    expect(user.hasAccessTo[Feature.Triggers]).toBe(true)
  })

  test("User in only supervisor group", () => {
    const user = createUser(UserGroup.Supervisor)

    expect(user.hasAccessTo[Feature.Exceptions]).toBe(true)
    expect(user.hasAccessTo[Feature.Triggers]).toBe(true)
  })

  test("User in all non-handler groups", () => {
    const user = createUser(
      UserGroup.Audit,
      UserGroup.AuditLoggingManager,
      UserGroup.NewUI,
      UserGroup.SuperUserManager,
      UserGroup.UserManager
    )

    expect(user.hasAccessTo[Feature.Exceptions]).toBe(false)
    expect(user.hasAccessTo[Feature.Triggers]).toBe(false)
  })

  test("User with no groups", () => {
    const user = createUser()

    expect(user.hasAccessTo[Feature.Exceptions]).toBe(false)
    expect(user.hasAccessTo[Feature.Triggers]).toBe(false)
  })

  test("An user who's groups have more permissions than a trigger handler has the feature flag exceptions_enabled set to false, should not have access to exceptions", () => {
    const user = createUser(
      UserGroup.Audit,
      UserGroup.AuditLoggingManager,
      UserGroup.NewUI,
      UserGroup.SuperUserManager,
      UserGroup.UserManager,
      UserGroup.GeneralHandler
    )

    user.featureFlags = { exceptionsEnabled: false }

    expect(user.hasAccessTo[Feature.ExceptionsEnabled]).toBe(false)
    expect(user.hasAccessTo[Feature.Triggers]).toBe(true)
  })

  test("An user who's groups have more permissions than a trigger handler has the feature flag exceptions_enabled set to true, should have access to exceptions", () => {
    const user = createUser(
      UserGroup.Audit,
      UserGroup.AuditLoggingManager,
      UserGroup.NewUI,
      UserGroup.SuperUserManager,
      UserGroup.UserManager,
      UserGroup.GeneralHandler
    )

    user.featureFlags = { exceptionsEnabled: true }

    expect(user.hasAccessTo[Feature.ExceptionsEnabled]).toBe(true)
    expect(user.hasAccessTo[Feature.Triggers]).toBe(true)
  })
})

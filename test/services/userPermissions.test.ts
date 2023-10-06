import { expect } from "@jest/globals"
import User from "services/entities/User"
import Feature from "types/Feature"
import { UserGroup } from "types/UserGroup"

const createUser = (...groups: UserGroup[]) => {
  const user = new User()
  user.groups = [...groups]

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
    expect(user.hasAccessTo[Feature.ViewReports]).toBe(true)
  })

  test("User in all groups except supervisor", () => {
    const user = createUser(
      UserGroup.Allocator,
      UserGroup.Audit,
      UserGroup.ExceptionHandler,
      UserGroup.GeneralHandler,
      UserGroup.TriggerHandler,
      UserGroup.UserManager,
      UserGroup.AuditLoggingManager,
      UserGroup.SuperUserManager,
      UserGroup.NewUI
    )
    expect(user.hasAccessTo[Feature.ViewReports]).toBe(false)
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

  test("User in user manager group", () => {
    const user = createUser(

      UserGroup.SuperUserManager,
      UserGroup.UserManager
    )

    expect(user.hasAccessTo[Feature.ViewUserManagement]).toBe(true)
  })

  test("User in all groups except user manager groups", () => {
    const user = createUser(
      UserGroup.Allocator,
      UserGroup.Audit,
      UserGroup.ExceptionHandler,
      UserGroup.GeneralHandler,
      UserGroup.TriggerHandler,
      UserGroup.AuditLoggingManager,
      UserGroup.NewUI,
      UserGroup.Supervisor
    )
    expect(user.hasAccessTo[Feature.ViewUserManagement]).toBe(false)
  })

  test("User with no groups", () => {
    const user = createUser()

    expect(user.hasAccessTo[Feature.Exceptions]).toBe(false)
    expect(user.hasAccessTo[Feature.Triggers]).toBe(false)
  })
})

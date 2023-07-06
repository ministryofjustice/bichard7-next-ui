import { expect } from "@jest/globals"
import User from "services/entities/User"
import { UserGroup } from "types/UserGroup"

const createUser = (...groups: UserGroup[]) => {
  const user = new User()
  user.groups = [...groups]

  return user
}

describe("user permissions", () => {
  test("hasAccessToExceptions should be true and hasAccessToTriggers should be false when user is in Exception Handler group", () => {
    const user = createUser(UserGroup.ExceptionHandler)

    expect(user.hasAccessToExceptions).toBe(true)
    expect(user.hasAccessToTriggers).toBe(false)
  })

  test("hasAccessToExceptions should be false and hasAccessToTriggers should be true when user is in Trigger Handler group", () => {
    const user = createUser(UserGroup.TriggerHandler)

    expect(user.hasAccessToExceptions).toBe(false)
    expect(user.hasAccessToTriggers).toBe(true)
  })

  test("hasAccessToExceptions and hasAccessToTriggers should be true when user is in General Handler group", () => {
    const user = createUser(UserGroup.GeneralHandler)

    expect(user.hasAccessToExceptions).toBe(true)
    expect(user.hasAccessToTriggers).toBe(true)
  })

  test("hasAccessToExceptions and hasAccessToTriggers should return true when user is in Allocator group", () => {
    const user = createUser(UserGroup.Allocator)

    expect(user.hasAccessToExceptions).toBe(true)
    expect(user.hasAccessToTriggers).toBe(true)
  })

  test("hasAccessToExceptions and hasAccessToTriggers should be true when user is in Supervisor group", () => {
    const user = createUser(UserGroup.Supervisor)

    expect(user.hasAccessToExceptions).toBe(true)
    expect(user.hasAccessToTriggers).toBe(true)
  })

  test("hasAccessToExceptions and hasAccessToTriggers should be false when user is in any other groups", () => {
    const user = createUser(
      UserGroup.Audit,
      UserGroup.AuditLoggingManager,
      UserGroup.NewUI,
      UserGroup.SuperUserManager,
      UserGroup.UserManager
    )

    expect(user.hasAccessToExceptions).toBe(false)
    expect(user.hasAccessToTriggers).toBe(false)
  })
})

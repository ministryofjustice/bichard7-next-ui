import { expect } from "@jest/globals"
import User from "services/entities/User"
import { UserGroup } from "types/UserGroup"
import { hasAccessToExceptions, hasAccessToTriggers } from "utils/userPermissions"

const createUser = (...groups: UserGroup[]) => {
  const user = new User()
  user.groups = [...groups]

  return user
}

describe("userPermissions", () => {
  test("hasAccessToExceptions should return true and hasAccessToTriggers should return false when user is in Exception Handler group", () => {
    const user = createUser(UserGroup.ExceptionHandler)

    expect(hasAccessToExceptions(user)).toBe(true)
    expect(hasAccessToTriggers(user)).toBe(false)
  })

  test("hasAccessToExceptions should return false and hasAccessToTriggers should return true when user is in Trigger Handler group", () => {
    const user = createUser(UserGroup.TriggerHandler)

    expect(hasAccessToExceptions(user)).toBe(false)
    expect(hasAccessToTriggers(user)).toBe(true)
  })

  test("hasAccessToExceptions and hasAccessToTriggers should return true when user is in General Handler group", () => {
    const user = createUser(UserGroup.GeneralHandler)

    expect(hasAccessToExceptions(user)).toBe(true)
    expect(hasAccessToTriggers(user)).toBe(true)
  })

  test("hasAccessToExceptions and hasAccessToTriggers should return true when user is in Allocator group", () => {
    const user = createUser(UserGroup.Allocator)

    expect(hasAccessToExceptions(user)).toBe(true)
    expect(hasAccessToTriggers(user)).toBe(true)
  })

  test("hasAccessToExceptions and hasAccessToTriggers should return true when user is in Supervisor group", () => {
    const user = createUser(UserGroup.Supervisor)

    expect(hasAccessToExceptions(user)).toBe(true)
    expect(hasAccessToTriggers(user)).toBe(true)
  })

  test("hasAccessToExceptions and hasAccessToTriggers should return false when user is in any other groups", () => {
    const user = createUser(
      UserGroup.Audit,
      UserGroup.AuditLoggingManager,
      UserGroup.NewUI,
      UserGroup.SuperUserManager,
      UserGroup.UserManager
    )

    expect(hasAccessToExceptions(user)).toBe(false)
    expect(hasAccessToTriggers(user)).toBe(false)
  })
})

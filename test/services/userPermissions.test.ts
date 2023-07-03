import { expect } from "@jest/globals"
import User from "services/entities/User"
import { UserGroup } from "types/UserGroup"
import { canLockExceptions, canLockTriggers } from "utils/userPermissions"

const createUser = (...groups: UserGroup[]) => {
  const user = new User()
  user.groups = [...groups]

  return user
}

describe("userPermissions", () => {
  test("canLockExceptions should return true and canLockTriggers should return false when user is in Exception Handler group", () => {
    const user = createUser(UserGroup.ExceptionHandler)

    expect(canLockExceptions(user)).toBe(true)
    expect(canLockTriggers(user)).toBe(false)
  })

  test("canLockExceptions should return false and canLockTriggers should return true when user is in Trigger Handler group", () => {
    const user = createUser(UserGroup.TriggerHandler)

    expect(canLockExceptions(user)).toBe(false)
    expect(canLockTriggers(user)).toBe(true)
  })

  test("canLockExceptions and canLockTriggers should return true when user is in General Handler group", () => {
    const user = createUser(UserGroup.GeneralHandler)

    expect(canLockExceptions(user)).toBe(true)
    expect(canLockTriggers(user)).toBe(true)
  })

  test("canLockExceptions and canLockTriggers should return true when user is in Allocator group", () => {
    const user = createUser(UserGroup.Allocator)

    expect(canLockExceptions(user)).toBe(true)
    expect(canLockTriggers(user)).toBe(true)
  })

  test("canLockExceptions and canLockTriggers should return true when user is in Supervisor group", () => {
    const user = createUser(UserGroup.Supervisor)

    expect(canLockExceptions(user)).toBe(true)
    expect(canLockTriggers(user)).toBe(true)
  })

  test("canLockExceptions and canLockTriggers should return false when user is in any other groups", () => {
    const user = createUser(
      UserGroup.Audit,
      UserGroup.AuditLoggingManager,
      UserGroup.NewUI,
      UserGroup.SuperUserManager,
      UserGroup.UserManager
    )

    expect(canLockExceptions(user)).toBe(false)
    expect(canLockTriggers(user)).toBe(false)
  })
})

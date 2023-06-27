import { expect } from "@jest/globals"
import User from "services/entities/User"
import { UserGroup } from "types/UserGroup"

const createUser = (...groups: UserGroup[]) => {
  const user = new User()
  user.groups = [...groups]

  return user
}

describe("User", () => {
  test("canLockExceptions should return true and canLockTriggers should return false when user is in Exception Handler group", () => {
    const user = createUser(UserGroup.ExceptionHandler)

    expect(user.canLockExceptions).toBe(true)
    expect(user.canLockTriggers).toBe(false)
  })

  test("canLockExceptions should return false and canLockTriggers should return true when user is in Trigger Handler group", () => {
    const user = createUser(UserGroup.TriggerHandler)

    expect(user.canLockExceptions).toBe(false)
    expect(user.canLockTriggers).toBe(true)
  })

  test("canLockExceptions and canLockTriggers should return true when user is in General Handler group", () => {
    const user = createUser(UserGroup.GeneralHandler)

    expect(user.canLockExceptions).toBe(true)
    expect(user.canLockTriggers).toBe(true)
  })

  test("canLockExceptions and canLockTriggers should return true when user is in Allocator group", () => {
    const user = createUser(UserGroup.Allocator)

    expect(user.canLockExceptions).toBe(true)
    expect(user.canLockTriggers).toBe(true)
  })

  test("canLockExceptions and canLockTriggers should return true when user is in Supervisor group", () => {
    const user = createUser(UserGroup.Supervisor)

    expect(user.canLockExceptions).toBe(true)
    expect(user.canLockTriggers).toBe(true)
  })

  test("canLockExceptions and canLockTriggers should return false when user is in any other groups", () => {
    const user = createUser(
      UserGroup.Audit,
      UserGroup.AuditLoggingManager,
      UserGroup.NewUI,
      UserGroup.SuperUserManager,
      UserGroup.UserManager
    )

    expect(user.canLockExceptions).toBe(false)
    expect(user.canLockTriggers).toBe(false)
  })
})

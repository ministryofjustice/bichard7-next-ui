import { expect } from "@jest/globals"
import User from "services/entities/User"
import GroupName, { Groups } from "types/GroupName"

const createUser = (...groups: GroupName[]) => {
  const user = new User()
  user.groups = [...groups]

  return user
}

describe("User", () => {
  test("canLockExceptions should return true and canLockTriggers should return false when user is in Exception Handler group", () => {
    const user = createUser(Groups.ExceptionHandler)

    expect(user.canLockExceptions).toBe(true)
    expect(user.canLockTriggers).toBe(false)
  })

  test("canLockExceptions should return false and canLockTriggers should return true when user is in Trigger Handler group", () => {
    const user = createUser(Groups.TriggerHandler)

    expect(user.canLockExceptions).toBe(false)
    expect(user.canLockTriggers).toBe(true)
  })

  test("canLockExceptions and canLockTriggers should return true when user is in General Handler group", () => {
    const user = createUser(Groups.GeneralHandler)

    expect(user.canLockExceptions).toBe(true)
    expect(user.canLockTriggers).toBe(true)
  })

  test("canLockExceptions and canLockTriggers should return true when user is in Allocator group", () => {
    const user = createUser(Groups.Allocator)

    expect(user.canLockExceptions).toBe(true)
    expect(user.canLockTriggers).toBe(true)
  })

  test("canLockExceptions and canLockTriggers should return true when user is in Supervisor group", () => {
    const user = createUser(Groups.Supervisor)

    expect(user.canLockExceptions).toBe(true)
    expect(user.canLockTriggers).toBe(true)
  })

  test("canLockExceptions and canLockTriggers should return false when user is in any other groups", () => {
    const user = createUser(
      Groups.Audit,
      Groups.AuditLoggingManager,
      Groups.NewUI,
      Groups.SuperUserManager,
      Groups.UserManager
    )

    expect(user.canLockExceptions).toBe(false)
    expect(user.canLockTriggers).toBe(false)
  })
})

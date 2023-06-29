import User from "services/entities/User"
import { UserGroup } from "types/UserGroup"

const canLockTriggers = (user: User) => {
  return user.groups.some(
    (group) =>
      group === UserGroup.TriggerHandler ||
      group === UserGroup.GeneralHandler ||
      group === UserGroup.Allocator ||
      group === UserGroup.Supervisor
  )
}

const canLockExceptions = (user: User) => {
  return user.groups.some(
    (group) =>
      group === UserGroup.ExceptionHandler ||
      group === UserGroup.GeneralHandler ||
      group === UserGroup.Allocator ||
      group === UserGroup.Supervisor
  )
}

const isSupervisor = (user: User) => {
  return user.groups.some((group) => group === UserGroup.Supervisor)
}

export { canLockExceptions, canLockTriggers, isSupervisor }

import type User from "services/entities/User"
import { UserGroup } from "types/UserGroup"

const hasAccessToTriggers = (user: User) => {
  return user.groups.some(
    (group) =>
      group === UserGroup.TriggerHandler ||
      group === UserGroup.GeneralHandler ||
      group === UserGroup.Allocator ||
      group === UserGroup.Supervisor
  )
}

const hasAccessToExceptions = (user: User) => {
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

export { hasAccessToExceptions, hasAccessToTriggers, isSupervisor }

import Feature from "../types/Feature"
import { UserGroup } from "../types/UserGroup"

// This type is used instead of the User entity to avoid dependency cycles
type User = { groups: UserGroup[] }

const hasAccessToTriggers = (user: User): boolean => {
  return (
    user.groups !== undefined &&
    user.groups.some(
      (group) =>
        group === UserGroup.TriggerHandler ||
        group === UserGroup.GeneralHandler ||
        group === UserGroup.Allocator ||
        group === UserGroup.Supervisor
    )
  )
}

const hasAccessToExceptions = (user: User): boolean => {
  return (
    user.groups !== undefined &&
    user.groups.some(
      (group) =>
        group === UserGroup.ExceptionHandler ||
        group === UserGroup.GeneralHandler ||
        group === UserGroup.Allocator ||
        group === UserGroup.Supervisor
    )
  )
}

const isSupervisor = (user: User): boolean => {
  return user.groups !== undefined && user.groups.some((group) => group === UserGroup.Supervisor)
}

const isUserManager = (user: User): boolean => {
  return user.groups !== undefined && user.groups.some((group) => group === UserGroup.UserManager || group === UserGroup.SuperUserManager)
}

const userAccess = (user: User): { [key in Feature]: boolean } => {
  return {
    [Feature.Triggers]: hasAccessToTriggers(user),
    [Feature.Exceptions]: hasAccessToExceptions(user),
    [Feature.CaseDetailsSidebar]: hasAccessToTriggers(user) || hasAccessToExceptions(user),
    [Feature.UnlockOtherUsersCases]: isSupervisor(user),
    [Feature.ListAllCases]: isSupervisor(user),
    [Feature.ViewReports]: isSupervisor(user),
    [Feature.ViewUserManagement]: isUserManager(user)
  }
}

export { hasAccessToTriggers, hasAccessToExceptions, isSupervisor, userAccess }

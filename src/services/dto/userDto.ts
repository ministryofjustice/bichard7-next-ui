import User from "services/entities/User"
import { CurrentUser, OtherUser } from "types/Users"

export const userToCurrentUserDto = (user: User): CurrentUser => {
  const currentUser: CurrentUser = {
    username: user.username,
    email: user.email,
    forenames: user.forenames,
    surname: user.surname,
    visibleForces: user.visibleForces,
    visibleCourts: user.visibleCourts,
    excludedTriggers: user.excludedTriggers,
    featureFlags: user.featureFlags,
    groups: user.groups,
    hasAccessTo: user.hasAccessTo
  }

  return currentUser
}

export const userToOtherUserDto = (user: User): OtherUser => {
  const currentUser: OtherUser = {
    username: user.username,
    forenames: user.forenames,
    surname: user.surname
  }

  return currentUser
}

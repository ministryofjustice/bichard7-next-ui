import User from "services/entities/User"
import { CurrentUser } from "types/Users"

const userToCurrentUser = (user: User): CurrentUser => {
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

export default userToCurrentUser

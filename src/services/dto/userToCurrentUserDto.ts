import User from "services/entities/User"
import { CurrentUserDto } from "types/Users"

const userToCurrentUserDto = (user: User): CurrentUserDto => {
  const currentUserDto: CurrentUserDto = {
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

  return currentUserDto
}

export default userToCurrentUserDto

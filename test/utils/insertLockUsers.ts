import { InsertResult } from "typeorm"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import { getDummyUser } from "./manageUsers"
import { insertUsersWithOverrides } from "./manageUsers"
import { formatForenames, formatSurname } from "./userName"

export const insertLockUsers = async (lockedCase: CourtCase): Promise<InsertResult> => {
  const users: User[] = []

  if (lockedCase.errorLockedByUsername) {
    const username = lockedCase.errorLockedByUsername
    const [forenames, surname] = username.split(".")
    const user = await getDummyUser({
      username,
      forenames: formatForenames(forenames),
      surname: formatSurname(surname),
      email: `${username}@example.com`
    })
    users.push(user)
  }

  if (lockedCase.triggerLockedByUsername) {
    const username = lockedCase.triggerLockedByUsername
    const [forenames, surname] = username.split(".")
    const user = await getDummyUser({
      username,
      forenames: formatForenames(forenames),
      surname: formatSurname(surname),
      email: `${username}@example.com`
    })
    users.push(user)
  }

  return insertUsersWithOverrides(users)
}

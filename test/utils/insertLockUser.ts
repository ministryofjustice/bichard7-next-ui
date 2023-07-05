import { InsertResult } from "typeorm"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import { getDummyUser } from "./manageUsers"
import { insertUsersWithOverrides } from "./manageUsers"

export const insertLockUser = async (lockedCase: CourtCase): Promise<InsertResult> => {
  const users: User[] = []

  if (lockedCase.errorLockedByUsername) {
    const username = lockedCase.errorLockedByUsername
    const [forenames, surname] = username.split(".")
    const user = await getDummyUser({
      username,
      forenames,
      surname,
      email: `${username}@example.com`
    })
    users.push(user)
  }

  if (lockedCase.triggerLockedByUsername) {
    const username = lockedCase.triggerLockedByUsername
    const [forenames, surname] = username.split(".")
    const user = await getDummyUser({
      username,
      forenames: forenames
        .split(" ")
        .map((name) => name.charAt(0).toLocaleUpperCase() + name.slice(1))
        .join(" "),
      surname: surname.charAt(0).toLocaleUpperCase() + surname.slice(1),
      email: `${username}@example.com`
    })
    users.push(user)
  }

  return insertUsersWithOverrides(users)
}

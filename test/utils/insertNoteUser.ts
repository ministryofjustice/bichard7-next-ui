import { InsertResult } from "typeorm"
import Note from "services/entities/Note"
import { getDummyUser } from "./manageUsers"
import { insertUsers } from "./manageUsers"
import { formatForenames, formatSurname } from "./userName"

export const insertNoteUser = async (lockedCase: Note): Promise<InsertResult> => {
  const username = lockedCase.userId
  const [forenames, surname] = username.split(".")
  const user = await getDummyUser({
    username,
    forenames: formatForenames(forenames),
    surname: formatSurname(surname),
    email: `${username}@example.com`
  })

  return insertUsers(user)
}

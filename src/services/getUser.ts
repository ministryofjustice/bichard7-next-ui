import { DataSource, EntityManager } from "typeorm"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import User from "./entities/User"

export default async (
  dataSource: DataSource | EntityManager,
  username: string,
  groups?: string[]
): PromiseResult<User | null> => {
  const user = await dataSource
    .getRepository(User)
    .findOneBy({ username: username })
    .catch((error) => error)

  if (isError(user)) {
    return user
  }

  if (groups && groups.length > 0) {
    user.groups = groups.map((group) => group.substring(2).replace("_grp", ""))
  }

  return user
}

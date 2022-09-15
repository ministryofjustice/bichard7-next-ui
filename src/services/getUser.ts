import { DataSource, EntityManager } from "typeorm"
import GroupName from "types/GroupName"
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
    .catch((error: Error) => error)

  if (isError(user)) {
    return user
  }

  if (user && groups && groups.length > 0) {
    user.groups = groups
      .map((group) => group.match(/(?:B7)?(?<groupName>.*)(?:_grp)?/)?.groups?.groupName)
      .map((group) => group as GroupName)
  }

  return user
}

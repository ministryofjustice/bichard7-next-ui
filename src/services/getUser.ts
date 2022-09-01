import { DataSource, EntityManager } from "typeorm"
import PromiseResult from "types/PromiseResult"
import User from "./entities/User"

export default async (dataSource: DataSource | EntityManager, username: string): PromiseResult<User | null> => {
  return await dataSource
    .getRepository(User)
    .findOneBy({ username: username })
    .catch((error) => error)
}

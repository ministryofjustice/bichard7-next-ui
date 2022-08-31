import User from "../../src/services/entities/User"
import getDataSource from "../../src/services/getDataSource"
import { InsertResult } from "typeorm"

const DUMMY_USER: Partial<User> = {
  username: `Bichard01`,
  visibleForces: [`01`],
  forenames: "Bichard Test User",
  surname: `01`,
  email: `bichard01@example.com`,
  featureFlags: {}
}

const getDummyUser = async (overrides?: Partial<User>): Promise<User> =>
  (await getDataSource()).getRepository(User).create({
    ...DUMMY_USER,
    ...overrides
  } as User)

const insertUsers = async (users: User | User[]): Promise<InsertResult> => {
  const dataSource = await getDataSource()
  return await dataSource.createQueryBuilder().insert().into(User).values(users).execute()
}

const deleteUsers = async (): Promise<InsertResult> => {
  const dataSource = await getDataSource()
  return await dataSource.manager.query(`DELETE FROM br7own.users_groups; DELETE FROM br7own.users`)
}

export { getDummyUser, insertUsers, deleteUsers }

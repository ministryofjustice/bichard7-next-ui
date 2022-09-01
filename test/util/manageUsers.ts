import User from "../../src/services/entities/User"
import getDataSource from "../../src/services/getDataSource"
import { InsertResult } from "typeorm"

const TemplateUser: Partial<User> = {
  username: `Bichard01`,
  visibleForces: [`01`],
  forenames: "Bichard Test User",
  surname: `01`,
  email: `bichard01@example.com`,
  featureFlags: { test_flag: true, test_flag_2: false }
}

const getDummyUser = async (overrides?: Partial<User>): Promise<User> =>
  (await getDataSource()).getRepository(User).create({
    ...TemplateUser,
    ...overrides
  } as User)

const insertUsers = async (users: User | User[]): Promise<InsertResult> => {
  const dataSource = await getDataSource()
  return dataSource.createQueryBuilder().insert().into(User).values(users).execute()
}

const insertUsersWithOverrides = async (userOverrides: Partial<User>[]) => {
  const usersToInsert: User[] = []
  for (let i = 0; i < userOverrides.length; i++) {
    usersToInsert.push(await getDummyUser({ ...userOverrides[i] }))
  }

  return insertUsers(usersToInsert)
}

const deleteUsers = async (): Promise<InsertResult> => {
  const dataSource = await getDataSource()
  return dataSource.manager.query(`DELETE FROM br7own.users_groups; DELETE FROM br7own.users`)
}

export { getDummyUser, insertUsers, insertUsersWithOverrides, deleteUsers }

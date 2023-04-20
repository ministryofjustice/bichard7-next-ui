import User from "../../src/services/entities/User"
import getDataSource from "../../src/services/getDataSource"
import { InsertResult } from "typeorm"

const TemplateUser: Partial<User> = {
  username: `Bichard01`,
  visibleForces: [`01`],
  visibleCourts: [],
  forenames: "Bichard Test User",
  password: "",
  surname: `01`,
  email: `bichard01@example.com`,
  featureFlags: { test_flag: true, test_flag_2: false }
}

const getDummyUser = async (overrides?: Partial<User>): Promise<User> =>
  (await getDataSource()).getRepository(User).create({
    ...TemplateUser,
    ...overrides
  } as User)

const insertUserIntoGroup = async (emailAddress: string, groupName: string): Promise<InsertResult> => {
  const dataSource = await getDataSource()
  return dataSource.manager.query(
    `
    INSERT INTO 
      br7own.users_groups(
      group_id, 
      user_id
    ) VALUES (
      (SELECT id FROM br7own.groups WHERE name=$1 LIMIT 1),
      (SELECT id FROM br7own.users WHERE email=$2 LIMIT 1)
    )`,
    [groupName, emailAddress]
  )
}

const runQuery = async (query: string) => {
  const dataSource = await getDataSource()
  return dataSource.manager.query(query)
}

const insertUsers = async (users: User | User[], userGroups?: string[]): Promise<InsertResult> => {
  const dataSource = await getDataSource()
  const result = await dataSource.createQueryBuilder().insert().into(User).values(users).execute()
  if (userGroups) {
    userGroups.forEach(async (userGroup) => {
      if (Array.isArray(users)) {
        users.forEach(async (user) => {
          await insertUserIntoGroup(user.email, userGroup)
        })
      } else {
        await insertUserIntoGroup(users.email, userGroup)
      }
    })
  }
  return result
}

const insertUsersWithOverrides = async (userOverrides: Partial<User>[], userGroups?: string[]) => {
  const usersToInsert: User[] = []
  for (let i = 0; i < userOverrides.length; i++) {
    usersToInsert.push(await getDummyUser({ ...userOverrides[i] }))
  }

  return insertUsers(usersToInsert, userGroups)
}

const deleteUsers = async (): Promise<InsertResult> => {
  const dataSource = await getDataSource()
  return dataSource.manager.query(`DELETE FROM br7own.users_groups; DELETE FROM br7own.users`)
}

export { getDummyUser, insertUsers, insertUsersWithOverrides, deleteUsers, insertUserIntoGroup, runQuery }

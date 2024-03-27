import { InsertResult } from "typeorm"
import User from "../../src/services/entities/User"
import getDataSource from "../../src/services/getDataSource"

const TemplateUser: Partial<User> = {
  username: `Bichard01`,
  visibleForces: [1],
  visibleCourts: [],
  excludedTriggers: [],
  forenames: "Bichard Test User",
  password: "",
  surname: `01`,
  email: `bichard01@example.com`,
  featureFlags: { test_flag: true, exceptionsEnabled: true }
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
    )
    SELECT G.id, U.id FROM br7own.users AS U, br7own."groups" AS G
    WHERE
    	G.id = (SELECT id FROM br7own.groups WHERE name=$1 LIMIT 1)
    	AND
    	U.id = (SELECT id FROM br7own.users WHERE email=$2 LIMIT 1)
    	AND
    	NOT EXISTS (SELECT * FROM br7own.users_groups AS UG WHERE UG.group_id = G.id AND UG.user_id = U.id)
    `,
    [groupName, emailAddress]
  )
}

const runQuery = async (query: string) => {
  const dataSource = await getDataSource()
  return dataSource.manager.query(query)
}

// DB names have pre and postfixes
const sanitiseGroupName = (name: string) => {
  if (name.match(/(?<=B7)(.*)(?=_grp)/)) {
    return name
  }

  return `B7${name}_grp`
}

const insertUsers = async (users: User | User[], userGroups?: string[]): Promise<InsertResult> => {
  const dataSource = await getDataSource()
  const result = await dataSource.createQueryBuilder().insert().into(User).values(users).orIgnore().execute()

  if (!userGroups?.length) {
    return result
  }

  await Promise.all(
    userGroups.flatMap((userGroup) => {
      const group = sanitiseGroupName(userGroup)
      return [users].flat().map((user) => insertUserIntoGroup(user.email, group))
    })
  )

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

export { deleteUsers, getDummyUser, insertUserIntoGroup, insertUsers, insertUsersWithOverrides, runQuery }

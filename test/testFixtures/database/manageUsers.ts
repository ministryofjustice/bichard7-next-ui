import User from "entities/User"
import getDataSource from "lib/getDataSource"

type TestUser = {
  id: number
  username: string
  visibleForces: string[]
  forenames: string
  surname: string
  email: string
}

const insertUsers = async (users: TestUser[]): Promise<boolean> => {
  const dataSource = await getDataSource()

  await dataSource.createQueryBuilder().insert().into(User).values(users).execute()

  await dataSource.destroy()

  return true
}

const deleteUsers = async (): Promise<boolean> => {
  const dataSource = await getDataSource()

  await dataSource.manager.query(`DELETE FROM br7own.users_groups`)
  await dataSource.manager.query(`DELETE FROM br7own.users`)

  await dataSource.destroy()

  return true
}

export type { TestUser }
export { insertUsers, deleteUsers }

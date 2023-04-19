import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient()

const numberOfUsers = async () => {
  const users = await prisma.users.count()
  console.log("number of users: ", users)
  return users
}
numberOfUsers()

const numberOfCases = async () => {
  const cases = await prisma.error_list.count()
  console.log("number of cases: ", cases)
  return cases
}
numberOfCases()

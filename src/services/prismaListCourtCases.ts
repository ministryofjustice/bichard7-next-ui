import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const prismaListCourtCases = async () => {
  const courtCases = await prisma.error_list.findMany()
  console.log(courtCases)
  return courtCases
}

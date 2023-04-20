import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const prismaListCourtCases = async (filterOptions?: { defendant_name: string }) => {
  let filters = {}

  if (filterOptions?.defendant_name) {
    filters = {
      where: {
        defendant_name: {
          contains: filterOptions.defendant_name
        }
      }
    }
  }

  const courtCases = await prisma.error_list.findMany(filters)
  return courtCases
}

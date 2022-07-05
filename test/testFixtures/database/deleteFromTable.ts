import { EntityTarget, ObjectLiteral } from "typeorm"
import getTestConnection from "../getTestConnection"

const deleteFromTable = async(entity: EntityTarget<ObjectLiteral>) => {
  const connection = await getTestConnection()

  return connection.getRepository(entity).createQueryBuilder().delete().execute()
}

export default deleteFromTable

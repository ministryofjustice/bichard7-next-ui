import getDataSource from "../../../src/lib/getDataSource"
import { EntityTarget, ObjectLiteral } from "typeorm"

const deleteFromTable = async (entity: EntityTarget<ObjectLiteral>) => {
  const connection = await getDataSource()

  return connection.getRepository(entity).createQueryBuilder().delete().execute()
}

export default deleteFromTable

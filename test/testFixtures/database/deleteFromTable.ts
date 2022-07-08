import getDataSource from "../../../src/lib/getDataSource"
import { EntityTarget, ObjectLiteral } from "typeorm"

const deleteFromTable = async (entity: EntityTarget<ObjectLiteral>) => {
  const dataSource = await getDataSource()

  return dataSource.getRepository(entity).createQueryBuilder().delete().execute()
}

export default deleteFromTable

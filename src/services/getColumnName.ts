import { ObjectLiteral, Repository } from "typeorm"

const getColumnName = <T extends ObjectLiteral>(repository: Repository<T>, propertyName: string): string => {
  const property = repository.metadata.columns.find((c) => c.propertyName === propertyName)

  if (!property) {
    throw Error(`${propertyName} does not exist in ${repository.metadata.tableName}`)
  }

  return property.databaseName
}

export default getColumnName

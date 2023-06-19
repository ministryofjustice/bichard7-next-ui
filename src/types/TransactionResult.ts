import { DeleteResult, InsertResult, UpdateResult } from "typeorm"

export type TransactionResult = InsertResult | DeleteResult | UpdateResult | Error

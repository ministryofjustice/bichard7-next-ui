import AuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AuditLogEvent"
import { DataSource, EntityManager } from "typeorm"
import PromiseResult from "types/PromiseResult"
import { TransactionResult } from "types/TransactionResult"

export async function auditLoggingTransaction(
  dataSource: DataSource | EntityManager,
  transaction: (events: AuditLogEvent[], entityManager: EntityManager) => Promise<TransactionResult>
): PromiseResult<TransactionResult> {
  const events: AuditLogEvent[] = []

  return dataSource.transaction("SERIALIZABLE", async (entityManager) => {
    const result = await transaction(events, entityManager)

    // call api to store events

    return result
  })
}

import AuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AuditLogEvent"
import { DataSource, EntityManager } from "typeorm"
import PromiseResult from "types/PromiseResult"

export async function auditLoggingTransaction(
  dataSource: DataSource | EntityManager,
  messageId: string,
  transaction: (events: AuditLogEvent[], entityManager: EntityManager) => Promise<void>
): PromiseResult<void> {
  const events: AuditLogEvent[] = []

  return dataSource.transaction("SERIALIZABLE", async (entityManager) => {
    const result = await transaction(events, entityManager)

    // call api to store events
    // POST api_path/me [events]

    return result
  })
}

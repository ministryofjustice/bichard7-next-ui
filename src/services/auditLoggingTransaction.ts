import AuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AuditLogEvent"
import { DataSource, EntityManager } from "typeorm"
import PromiseResult from "types/PromiseResult"
import fetch from "node-fetch"
import { AUDIT_LOG_API_URL } from "../config"

export async function auditLoggingTransaction(
  dataSource: DataSource | EntityManager,
  messageId: string,
  transaction: (events: AuditLogEvent[], entityManager: EntityManager) => Promise<void>
): PromiseResult<void> {
  const events: AuditLogEvent[] = []

  return dataSource.transaction("SERIALIZABLE", async (entityManager) => {
    const result = await transaction(events, entityManager)

    if (events.length === 0) {
      return result
    }

    const response = await fetch(`${AUDIT_LOG_API_URL}/messages/${messageId}/events`, {
      method: "POST",
      body: JSON.stringify(events)
    })

    if (!response.ok) {
      throw Error(`Failed to create audit logs: ${await response.text()}`)
    }

    return result
  })
}

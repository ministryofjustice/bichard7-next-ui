import AuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AuditLogEvent"
import { DataSource, EntityManager } from "typeorm"
import PromiseResult from "types/PromiseResult"
import fetch from "node-fetch"
import { AUDIT_LOG_API_KEY, AUDIT_LOG_API_URL } from "../config"
import type TransactionalOperations from "types/TransactionalOperations"

export async function auditLoggingTransaction(
  dataSource: DataSource | EntityManager,
  messageId: string,
  transactionalOperations: TransactionalOperations
): PromiseResult<void> {
  const events: AuditLogEvent[] = []

  return dataSource.transaction("SERIALIZABLE", async (entityManager) => {
    const result = await transactionalOperations(events, entityManager)

    if (events.length === 0) {
      return result
    }

    const response = await fetch(`${AUDIT_LOG_API_URL}/messages/${messageId}/events`, {
      method: "POST",
      body: JSON.stringify(events),
      headers: {
        "X-API-Key": AUDIT_LOG_API_KEY
      }
    })

    if (!response.ok) {
      throw Error(`Failed to create audit logs: ${await response.text()}`)
    }

    return result
  })
}

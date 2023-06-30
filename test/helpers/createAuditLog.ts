import { v4 as uuid } from "uuid"
import fetch from "node-fetch"
import { AUDIT_LOG_API_KEY, AUDIT_LOG_API_URL } from "../../src/config"

export default async function createAuditLog(messageId?: string) {
  const auditLog = {
    messageId: messageId ?? uuid(),
    caseId: uuid(),
    externalCorrelationId: uuid(),
    receivedDate: new Date().toISOString(),
    createdBy: uuid(),
    messageHash: uuid()
  }

  const response = await fetch(`${AUDIT_LOG_API_URL}/messages`, {
    method: "POST",
    headers: {
      "X-API-KEY": AUDIT_LOG_API_KEY
    },
    body: JSON.stringify(auditLog)
  })

  if (!response.ok) {
    throw Error(`Failed to create audit log for messageId ${messageId}. ${response.text()}`)
  }

  return auditLog
}

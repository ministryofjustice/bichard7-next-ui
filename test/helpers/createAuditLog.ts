import { v4 as uuid } from "uuid"
import fetch from "node-fetch"

export default async function createAuditLog(messageId?: string) {
  const auditLog = {
    messageId: messageId ?? uuid(),
    caseId: uuid(),
    externalCorrelationId: uuid(),
    receivedDate: new Date().toISOString(),
    createdBy: uuid(),
    messageHash: uuid()
  }

  await fetch(`http://localhost:3010/messages`, {
    method: "POST",
    body: JSON.stringify(auditLog)
  })

  return auditLog
}

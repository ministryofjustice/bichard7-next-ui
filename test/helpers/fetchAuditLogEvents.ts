import { AUDIT_LOG_API_URL } from "../../src/config"
import fetch from "node-fetch"

const fetchAuditLogEvents = async (messageId: string) => {
  const apiResult = await fetch(`${AUDIT_LOG_API_URL}/messages/${messageId}`)
  const auditLogs = (await apiResult.json()) as [{ events: [{ timestamp: string; eventCode: string }] }]
  return auditLogs[0].events
}

export default fetchAuditLogEvents

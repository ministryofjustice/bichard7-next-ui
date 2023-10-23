import { AuditLogEvent } from "@moj-bichard7-developers/bichard7-next-core/common/types/AuditLogEvent"
import { AUDIT_LOG_API_KEY, AUDIT_LOG_API_URL } from "../config"
import axios from "axios"
import { statusOk } from "../utils/http"

const storeAuditLogEvents = async (messageId: string, events: AuditLogEvent[]) => {
  if (events.length === 0) {
    return
  }

  return axios({
    url: `${AUDIT_LOG_API_URL}/messages/${messageId}/events`,
    method: "POST",
    headers: {
      "X-API-Key": AUDIT_LOG_API_KEY
    },
    data: JSON.stringify(events)
  })
    .then((response) => {
      if (!statusOk(response.status)) {
        throw Error(`Failed to create audit logs: ${response.data}`)
      }
    })
    .catch((err) => {
      throw Error(`Failed to create audit logs: ${err}`)
    })
}

export default storeAuditLogEvents

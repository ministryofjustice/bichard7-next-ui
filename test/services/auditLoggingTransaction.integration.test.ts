import { auditLoggingTransaction } from "services/auditLoggingTransaction"
import { DataSource } from "typeorm"
import createDummyCase from "../helpers/createDummyCase"
import getAuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/lib/auditLog/getAuditLogEvent"

describe("auditLoggingTransaction", () => {
  let dataSource: DataSource

  it("should update postgres and dynamoDB", async () => {
    const expectedEvent = getAuditLogEvent("information", "dummyEventType", "dummyEventSource", { key1: "value1" })
    const expectedCourtCaseId = 11

    await auditLoggingTransaction(dataSource, "courtCase.messageId", async (events, entityManager) => {
      await createDummyCase(entityManager, expectedCourtCaseId, "dummyOrgCode")
      events.push(expectedEvent)
    })

    // expect record created in PG
    // expect auditLog event exists in dynamo db
  })
})

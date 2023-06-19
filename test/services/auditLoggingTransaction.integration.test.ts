import { auditLoggingTransaction } from "services/auditLoggingTransaction"
import { DataSource } from "typeorm"
import getAuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/lib/auditLog/getAuditLogEvent"
import { v4 as uuid } from "uuid"
import { isError } from "types/Result"
import getDataSource from "services/getDataSource"
import fetch from "node-fetch"
import AuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AuditLogEvent"

describe("auditLoggingTransaction", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it("should update postgres and dynamoDB", async () => {
    const expectedEvent = getAuditLogEvent("information", "dummyEventType", "dummyEventSource", { key1: "value1" })
    const auditLog = {
      messageId: uuid(),
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

    const result = await auditLoggingTransaction(dataSource, auditLog.messageId, async (events, _) => {
      events.push(expectedEvent)
    }).catch((error) => error)

    expect(isError(result)).toBeFalsy()

    const apiResult = await fetch(`http://localhost:3010/messages/${auditLog.messageId}`)
    const [{ events }] = (await apiResult.json()) as [{ events: AuditLogEvent[] }]

    expect(events).toStrictEqual([
      {
        attributes: { key1: "value1" },
        category: "information",
        eventSource: "dummyEventSource",
        eventType: "dummyEventType",
        timestamp: expect.anything()
      }
    ])
  })

  it("should fail if audit logging API fails", async () => {
    const expectedEvent = getAuditLogEvent("information", "dummyEventType", "dummyEventSource", { key1: "value1" })
    const groupName = uuid()
    const messageId = uuid()

    const result = await auditLoggingTransaction(dataSource, messageId, async (events, entityManager) => {
      await entityManager.query("INSERT INTO br7own.groups(name, friendly_name) VALUES($1, $2)", [groupName, uuid()])

      events.push(expectedEvent)
    }).catch((error) => error)

    expect(isError(result)).toBeTruthy()
    expect((result as Error).message).toBe(
      `Failed to create audit logs: A message with Id ${messageId} does not exist in the database`
    )

    const queryResult = await dataSource.query("SELECT * FROM br7own.groups WHERE name=$1", [groupName])
    expect(queryResult).toHaveLength(0)
  })
})

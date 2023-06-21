import { auditLoggingTransaction } from "services/auditLoggingTransaction"
import { DataSource } from "typeorm"
import getAuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/lib/auditLog/getAuditLogEvent"
import { v4 as uuid } from "uuid"
import { isError } from "types/Result"
import getDataSource from "services/getDataSource"
import fetch from "node-fetch"
import AuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AuditLogEvent"
import createAuditLog from "../helpers/createAuditLog"

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
    const auditLog = await createAuditLog()
    const groupName = uuid()

    const result = await auditLoggingTransaction(dataSource, auditLog.messageId, async (events, entityManager) => {
      await entityManager.query("INSERT INTO br7own.groups(name, friendly_name) VALUES($1, $2)", [groupName, uuid()])

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

    const queryResult = await dataSource.query("SELECT * FROM br7own.groups WHERE name=$1", [groupName])
    expect(queryResult).toHaveLength(1)
  })

  it("should update postgres when there are no events", async () => {
    const groupName = uuid()

    const result = await auditLoggingTransaction(dataSource, uuid(), async (_events, entityManager) => {
      await entityManager.query("INSERT INTO br7own.groups(name, friendly_name) VALUES($1, $2)", [groupName, uuid()])
    }).catch((error) => error)

    expect(isError(result)).toBeFalsy()

    const queryResult = await dataSource.query("SELECT * FROM br7own.groups WHERE name=$1", [groupName])
    expect(queryResult).toHaveLength(1)
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

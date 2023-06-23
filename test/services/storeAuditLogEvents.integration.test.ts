import { DataSource } from "typeorm"
import getAuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/lib/auditLog/getAuditLogEvent"
import { v4 as uuid } from "uuid"
import { isError } from "types/Result"
import getDataSource from "services/getDataSource"
import fetch from "node-fetch"
import AuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AuditLogEvent"
import createAuditLog from "../helpers/createAuditLog"
import { AUDIT_LOG_API_KEY, AUDIT_LOG_API_URL } from "../../src/config"

jest.mock("node-fetch")

const testTransactionalOperations =
  (expectedEvents: AuditLogEvent[], groupName?: string): TransactionalOperations =>
  async (events, entityManager) => {
    if (groupName) {
      await entityManager.query("INSERT INTO br7own.groups(name, friendly_name) VALUES($1, $2)", [groupName, uuid()])
    }

    expectedEvents.forEach((event) => events.push(event))
  }

describe("storeAuditLogEvents", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  beforeEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()
    ;(fetch as unknown as jest.Mock).mockImplementation(jest.requireActual("node-fetch").default)
  })

  it("Should update postgres and dynamoDB", async () => {
    const expectedEvent = getAuditLogEvent("information", "dummyEventType", "dummyEventSource", { key1: "value1" })
    const auditLog = await createAuditLog()
    const groupName = uuid()

    const result = await auditLoggingTransaction(
      dataSource,
      auditLog.messageId,
      testTransactionalOperations([expectedEvent], groupName)
    ).catch((error) => error)

    expect(isError(result)).toBeFalsy()

    const apiResult = await fetch(`${AUDIT_LOG_API_URL}/messages/${auditLog.messageId}`)
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

  it("Should update postgres when there are no events", async () => {
    const groupName = uuid()

    const result = await auditLoggingTransaction(dataSource, uuid(), testTransactionalOperations([], groupName)).catch(
      (error) => error
    )

    expect(isError(result)).toBeFalsy()

    const queryResult = await dataSource.query("SELECT * FROM br7own.groups WHERE name=$1", [groupName])
    expect(queryResult).toHaveLength(1)
  })

  it("Should not update postgres when audit logging API fails", async () => {
    const expectedEvent = getAuditLogEvent("information", "dummyEventType", "dummyEventSource", { key1: "value1" })
    const groupName = uuid()
    const messageId = uuid()

    const result = await auditLoggingTransaction(
      dataSource,
      messageId,
      testTransactionalOperations([expectedEvent], groupName)
    ).catch((error) => error)

    expect(isError(result)).toBeTruthy()
    expect((result as Error).message).toBe(
      `Failed to create audit logs: A message with Id ${messageId} does not exist in the database`
    )

    const queryResult = await dataSource.query("SELECT * FROM br7own.groups WHERE name=$1", [groupName])
    expect(queryResult).toHaveLength(0)
  })

  it("Should not create audit log event when postgres query fails", async () => {
    const expectedEvent = getAuditLogEvent("information", "dummyEventType", "dummyEventSource", { key1: "value1" })
    const auditLog = await createAuditLog()

    const testTransactionalOperationsWithError: TransactionalOperations = async (events, _) => {
      events.push(expectedEvent)
      throw Error("Dummy error")
    }

    const result = await auditLoggingTransaction(
      dataSource,
      auditLog.messageId,
      testTransactionalOperationsWithError
    ).catch((error) => error)

    expect(isError(result)).toBeTruthy()
    expect((result as Error).message).toBe("Dummy error")

    const apiResult = await fetch(`${AUDIT_LOG_API_URL}/messages/${auditLog.messageId}`)
    const [{ events }] = (await apiResult.json()) as [{ events: AuditLogEvent[] }]

    expect(events).toHaveLength(0)
  })

  it("should pass through the api key as a header", async () => {
    ;(fetch as unknown as jest.Mock).mockImplementation(() => {
      return { ok: true }
    })

    const result = await auditLoggingTransaction(
      dataSource,
      "dummy_key",
      testTransactionalOperations([{} as AuditLogEvent])
    ).catch((error) => error)

    expect(isError(result)).toBeFalsy()

    expect(fetch).toBeCalledWith(`${AUDIT_LOG_API_URL}/messages/dummy_key/events`, {
      body: "[{}]",
      headers: { "X-API-Key": AUDIT_LOG_API_KEY },
      method: "POST"
    })
  })
})

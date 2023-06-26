import { DataSource } from "typeorm"
import getAuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/lib/auditLog/getAuditLogEvent"
import { v4 as uuid } from "uuid"
import { isError } from "types/Result"
import getDataSource from "services/getDataSource"
import fetch from "node-fetch"
import AuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AuditLogEvent"
import createAuditLog from "../helpers/createAuditLog"
import { AUDIT_LOG_API_KEY, AUDIT_LOG_API_URL } from "../../src/config"
import storeAuditLogEvents from "services/storeAuditLogEvents"

jest.mock("node-fetch")

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

  it("Should store audit log events in dynamoDB", async () => {
    const expectedEvent = getAuditLogEvent("information", "dummyEventType", "dummyEventSource", { key1: "value1" })
    const auditLog = await createAuditLog()

    const result = await storeAuditLogEvents(auditLog.messageId, [expectedEvent]).catch((error) => error)

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
  })

  it("Should return undefined with no error if events array is empty", async () => {
    const result = await storeAuditLogEvents(uuid(), []).catch((error) => error)
    expect(isError(result)).toBeFalsy()
    expect(result).toBeUndefined()
  })

  it("should pass through the api key as a header", async () => {
    ;(fetch as unknown as jest.Mock).mockImplementation(() => {
      return { ok: true }
    })

    const result = await storeAuditLogEvents("dummy_key", [{} as AuditLogEvent]).catch((error) => error)

    expect(isError(result)).toBeFalsy()

    expect(fetch).toBeCalledWith(`${AUDIT_LOG_API_URL}/messages/dummy_key/events`, {
      body: "[{}]",
      headers: { "X-API-Key": AUDIT_LOG_API_KEY },
      method: "POST"
    })
  })
})

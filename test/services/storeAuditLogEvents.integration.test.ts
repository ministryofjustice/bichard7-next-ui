import { DataSource } from "typeorm"
import getAuditLogEvent from "@moj-bichard7-developers/bichard7-next-core/dist/lib/auditLog/getAuditLogEvent"
import { v4 as uuid } from "uuid"
import { isError } from "types/Result"
import getDataSource from "services/getDataSource"
import axios from "axios"
import {
  AuditLogEvent,
  AuditLogEventOptions
} from "@moj-bichard7-developers/bichard7-next-core/dist/types/AuditLogEvent"
import createAuditLog from "../helpers/createAuditLog"
import { AUDIT_LOG_API_KEY, AUDIT_LOG_API_URL } from "../../src/config"
import storeAuditLogEvents from "services/storeAuditLogEvents"
import deleteFromDynamoTable from "../utils/deleteFromDynamoTable"
import EventCategory from "@moj-bichard7-developers/bichard7-next-core/dist/types/EventCategory"

jest.mock("axios")

describe("storeAuditLogEvents", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  beforeEach(async () => {
    jest.resetAllMocks()
    jest.clearAllMocks()
    await deleteFromDynamoTable("auditLogTable", "messageId")
    await deleteFromDynamoTable("auditLogEventsTable", "_id")
    ;(axios as unknown as jest.Mock).mockImplementation(jest.requireActual("axios").default)
  })

  it("Should store audit log events in dynamoDB", async () => {
    const expectedEvent = getAuditLogEvent(
      AuditLogEventOptions.reportRun,
      EventCategory.information,
      "dummyEventSource",
      { key1: "value1" }
    )
    const auditLog = await createAuditLog()

    const result = await storeAuditLogEvents(auditLog.messageId, [expectedEvent]).catch((error) => error)

    expect(isError(result)).toBeFalsy()

    const [record] = (await axios(`${AUDIT_LOG_API_URL}/messages/${auditLog.messageId}`)).data

    expect(record.events).toStrictEqual([
      {
        attributes: { key1: "value1" },
        category: "information",
        eventSource: "dummyEventSource",
        eventCode: "report-run",
        eventType: AuditLogEventOptions.reportRun.type,
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
    ;(axios as unknown as jest.Mock).mockResolvedValue({ status: 200 })

    const result = await storeAuditLogEvents("dummy_key", [{} as AuditLogEvent]).catch((error) => error)

    expect(isError(result)).toBeFalsy()

    expect(axios).toBeCalledWith({
      url: `${AUDIT_LOG_API_URL}/messages/dummy_key/events`,
      data: "[{}]",
      headers: { "X-API-Key": AUDIT_LOG_API_KEY },
      method: "POST"
    })
  })
})

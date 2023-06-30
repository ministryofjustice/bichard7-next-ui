import { subDays } from "date-fns"
import CourtCase from "../src/services/entities/CourtCase"
import Trigger from "../src/services/entities/Trigger"
import Note from "../src/services/entities/Trigger"
import getDataSource from "../src/services/getDataSource"
import createDummyCase from "../test/helpers/createDummyCase"
import deleteFromEntity from "../test/utils/deleteFromEntity"
import { KeyValuePair } from "../src/types/KeyValuePair"
import insertAuditLogIntoDynamoTable from "../test/utils/insertAuditLogIntoDynamoTable"
import { isError } from "../src/types/Result"

if (process.env.DEPLOY_NAME !== "e2e-test") {
  console.error("Not running in e2e environment, bailing out. Set DEPLOY_NAME='e2e-test' if you're sure.")
  process.exit(1)
}

const minCases = 500
const maxCases = 1_000
const forceId = process.env.FORCE_ID || "01"
const maxCaseAge = -12 * 30

const numCasesRange = maxCases - minCases
const numCases = Math.round(Math.random() * numCasesRange) + minCases

console.log(`Seeding ${numCases} cases for force ID ${forceId}`)

const createAuditLogRecord = (courtCase: CourtCase) => ({
  triggerStatus: courtCase.triggerCount ? "Generated" : "NoTriggers",
  messageId: courtCase.messageId,
  version: 2,
  isSanitised: 0,
  createdBy: "Seed data script",
  externalCorrelationId: courtCase.messageId,
  caseId: courtCase.messageId,
  messageHash: courtCase.messageId,
  pncStatus: "Processing",
  eventsCount: 0,
  receivedDate: courtCase.messageReceivedTimestamp.toISOString(),
  _: "_",
  status: "Processing"
})

getDataSource().then(async (dataSource) => {
  const entitiesToClear = [CourtCase, Trigger, Note]
  const auditLogs: KeyValuePair<string, unknown>[] = []
  await Promise.all(entitiesToClear.map((entity) => deleteFromEntity(entity)))

  await Promise.all(
    new Array(numCases).fill(0).map(async (_, idx) => {
      const courtCase = await createDummyCase(dataSource, idx, forceId, subDays(new Date(), maxCaseAge))
      auditLogs.push(createAuditLogRecord(courtCase))
    })
  )

  while (auditLogs.length) {
    const recordsToInsert = auditLogs.splice(0, 100)
    const insertAuditLogResult = await insertAuditLogIntoDynamoTable(recordsToInsert)

    if (isError(insertAuditLogResult)) {
      throw insertAuditLogResult
    }
  }
})

export {}

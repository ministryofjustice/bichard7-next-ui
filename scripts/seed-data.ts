import { subDays } from "date-fns"
import CourtCase from "../src/services/entities/CourtCase"
import Trigger from "../src/services/entities/Trigger"
import Note from "../src/services/entities/Trigger"
import getDataSource from "../src/services/getDataSource"
import createDummyCase from "../test/helpers/createDummyCase"
import deleteFromEntity from "../test/utils/deleteFromEntity"
import createAuditLog from "../test/helpers/createAuditLog"
import { isError } from "../src/types/Result"
import createDummyUser from "../test/helpers/createDummyUser"

const MAX_AUDIT_LOG_API_RETRY = 100

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

getDataSource().then(async (dataSource) => {
  const entitiesToClear = [CourtCase, Trigger, Note]
  await Promise.all(entitiesToClear.map((entity) => deleteFromEntity(entity)))

  const cases = await Promise.all(
    new Array(numCases).fill(0).map(async (_, idx) => {
      const courtCase = await createDummyCase(dataSource, idx, forceId, subDays(new Date(), maxCaseAge))

      let attempt = 0
      while (attempt < MAX_AUDIT_LOG_API_RETRY) {
        const createAuditLogResult = await createAuditLog(courtCase.messageId).catch((error) => error)
        if (!isError(createAuditLogResult)) {
          break
        }

        console.log(createAuditLogResult)
        await new Promise((resolve) => setTimeout(resolve, 500))
        attempt += 1
      }

      if (attempt === MAX_AUDIT_LOG_API_RETRY) {
        throw Error(`Reached the retry limit when creating audit log for message id ${courtCase.messageId}`)
      }

      return courtCase
    })
  )

  cases.forEach(async (courtCase) => {
    const username = courtCase.errorLockedByUserName
    if (username) {
      await createDummyUser(dataSource, username)
    }
  })
})

export {}

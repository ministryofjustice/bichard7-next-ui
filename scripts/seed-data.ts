import { subDays } from "date-fns"
import CourtCase from "../src/services/entities/CourtCase"
import Trigger from "../src/services/entities/Trigger"
import Note from "../src/services/entities/Trigger"
import getDataSource from "../src/services/getDataSource"
import createDummyCase from "../test/helpers/createDummyCase"
import deleteFromEntity from "../test/utils/deleteFromEntity"
import createDummyUser from "../test/helpers/createDummyUser"

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
    new Array(numCases)
      .fill(0)
      .map((_, idx) => createDummyCase(dataSource, idx, forceId, subDays(new Date(), maxCaseAge)))
  )

  cases.forEach(async (courtCase) => {
    const username = courtCase.errorLockedByUsername
    if (username) {
      await createDummyUser(dataSource, username)
    }
  })
})

export {}

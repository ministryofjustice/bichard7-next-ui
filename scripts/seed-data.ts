import { subDays } from "date-fns"
import getDataSource from "../src/services/getDataSource"
import createDummyCase from "../test/helpers/createDummyCase"
import { insertCourtCases } from "../test/utils/insertCourtCases"

const minCases = 100
const maxCases = 1_000
const forceId = process.env.FORCE_ID || "01"
const maxCaseAge = 12 * 30

const numCasesRange = maxCases - minCases
const numCases = Math.round(Math.random() * numCasesRange) + minCases

console.log(`Seeding ${numCases} cases for force ID ${forceId}`)

getDataSource().then(async (dataSource) => {
  const courtCases = new Array(numCases)
    .fill(0)
    .map(() => createDummyCase(dataSource, forceId, subDays(new Date(), maxCaseAge)))

  await insertCourtCases(courtCases)
})

export {}

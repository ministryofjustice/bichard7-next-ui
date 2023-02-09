/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { subDays } from "date-fns"
import Trigger from "../src/services/entities/Trigger"
import CourtCase from "../src/services/entities/CourtCase"
import getDataSource from "../src/services/getDataSource"
import createDummyCase from "../test/helpers/createDummyCase"
import deleteFromTable from "../test/utils/deleteFromTable"

const minCases = 100
const maxCases = 1_000
const forceId = process.env.FORCE_ID || "01"
const maxCaseAge = 12 * 30

const numCasesRange = maxCases - minCases
const numCases = Math.round(Math.random() * numCasesRange) + minCases

console.log(`Seeding ${numCases} cases for force ID ${forceId}`)

getDataSource().then(async (dataSource) => {
  await deleteFromTable(CourtCase)
  await deleteFromTable(Trigger)

  await Promise.all(
    new Array(numCases)
      .fill(0)
      .map((_, idx) => createDummyCase(dataSource, idx, forceId, subDays(new Date(), maxCaseAge)))
  )
})

export {}

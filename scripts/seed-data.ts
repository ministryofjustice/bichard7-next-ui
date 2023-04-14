import { subDays } from "date-fns"
import CourtCase from "../src/services/entities/CourtCase"
import Trigger from "../src/services/entities/Trigger"
import Note from "../src/services/entities/Trigger"
import getDataSource from "../src/services/getDataSource"
import createDummyCase from "../test/helpers/createDummyCase"
import deleteFromEntity from "../test/utils/deleteFromEntity"
import deleteFromTable from "../test/utils/deleteFromTable"
import User from "../src/services/entities/User"
import createDummyUsers from "../test/helpers/createDummyUsers"
import { GroupIds } from "../src/types/GroupName"

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
  const tablesToClear = ["team_membership", "team_supervision", "team", "users_groups"]
  await Promise.all(tablesToClear.map((table) => deleteFromTable(table)))

  const entitiesToClear = [CourtCase, Trigger, Note, User]
  await Promise.all(entitiesToClear.map((entity) => deleteFromEntity(entity)))

  const users = createDummyUsers()
  await dataSource.getRepository(User).insert(users)

  const userGroups = users.flatMap((user) =>
    user.groups.map((group) => {
      return [user.id, GroupIds[group]]
    })
  )

  await Promise.all(
    userGroups.map((userGroup) =>
      dataSource.query("INSERT INTO br7own.users_groups (user_id, group_id) VALUES ($1, $2);", userGroup)
    )
  )

  await Promise.all(
    new Array(numCases)
      .fill(0)
      .map((_, idx) => createDummyCase(dataSource, idx, forceId, subDays(new Date(), maxCaseAge)))
  )
})

export {}

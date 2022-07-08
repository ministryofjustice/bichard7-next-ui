/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { defineConfig } from "cypress"
import CourtCase from "entities/CourtCase"
import deleteFromTable from "./test/testFixtures/database/deleteFromTable"
import { insertCourtCasesWithOrgCodes } from "./test/testFixtures/database/insertCourtCases"
import { insertTriggers, TestTrigger } from "./test/testFixtures/database/manageTriggers"
import { deleteUsers, insertUsers, TestUser } from "./test/testFixtures/database/manageUsers"

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4080/bichard",
    setupNodeEvents(on, _config) {
      on("task", {
        insertCourtCasesWithOrgCodes(orgCodes: string[]) {
          return insertCourtCasesWithOrgCodes(orgCodes)
        },

        clearCourtCases() {
          return deleteFromTable(CourtCase)
        },

        insertUsers(users: TestUser[]) {
          return insertUsers(users)
        },

        clearUsers() {
          return deleteUsers()
        },

        insertTriggers(args) {
          return insertTriggers(args.caseId, args.triggers)
        }
      })
    }
  }
})

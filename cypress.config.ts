/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { defineConfig } from "cypress"
import CourtCase from "entities/CourtCase"
import deleteFromTable from "./test/testFixtures/database/deleteFromTable"
import { insertCourtCasesWithOrgCodes } from "./test/testFixtures/database/insertCourtCases"

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
        }
      })
    }
  }
})

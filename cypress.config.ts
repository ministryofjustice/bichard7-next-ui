/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { defineConfig } from "cypress"
import CourtCase from "services/entities/CourtCase"
import deleteFromTable from "./test/testFixtures/database/deleteFromTable"
import {
  insertCourtCases,
  insertCourtCasesWithCourtNames,
  insertCourtCasesWithDefendantNames,
  insertCourtCasesWithOrgCodes,
  insertMultipleDummyCourtCases
} from "./test/testFixtures/database/insertCourtCases"
import { insertTriggers } from "./test/testFixtures/database/manageTriggers"
import insertException from "./test/testFixtures/database/manageExceptions"
import { deleteUsers, insertUsers, TestUser } from "./test/testFixtures/database/manageUsers"

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4080/bichard",
    setupNodeEvents(on, _config) {
      on("task", {
        async insertCourtCasesWithOrgCodes(orgCodes: string[]) {
          return await insertCourtCasesWithOrgCodes(orgCodes)
        },

        async insertMultipleDummyCourtCases(params: { numToInsert: number; force: string }) {
          return await insertMultipleDummyCourtCases(params.numToInsert, params.force)
        },

        async insertCourtCasesWithCourtNames(params: { courtNames: string[]; force: string }) {
          return await insertCourtCasesWithCourtNames(params.courtNames, params.force)
        },

        async insertCourtCasesWithDefendantNames(params: { defendantNames: string[]; force: string }) {
          return await insertCourtCasesWithDefendantNames(params.defendantNames, params.force)
        },

        async insertCourtCases(params: { courtCases: CourtCase[] }) {
          return await insertCourtCases(params.courtCases)
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
        },

        insertException(params: { caseId: number; exceptionCode: string }) {
          return insertException(params.caseId, params.exceptionCode)
        }
      })
    }
  }
})

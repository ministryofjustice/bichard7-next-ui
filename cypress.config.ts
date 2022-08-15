/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { defineConfig } from "cypress"
import CourtCase from "services/entities/CourtCase"
import deleteFromTable from "./test/util/deleteFromTable"
import {
  insertCourtCases,
  insertCourtCasesWithCourtNames,
  insertCourtCasesWithDefendantNames,
  insertCourtCasesWithOrgCodes,
  insertMultipleDummyCourtCases,
  insertDummyCourtCaseWithLock
} from "./test/util/insertCourtCases"
import { insertTriggers } from "./test/util/manageTriggers"
import insertException from "./test/util/manageExceptions"
import { deleteUsers, insertUsers, TestUser } from "./test/util/manageUsers"

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4080/bichard",
    setupNodeEvents(on, _config) {
      on("task", {
        insertCourtCasesWithOrgCodes(orgCodes: string[]) {
          return insertCourtCasesWithOrgCodes(orgCodes)
        },

        insertMultipleDummyCourtCases(params: { numToInsert: number; force: string }) {
          return insertMultipleDummyCourtCases(params.numToInsert, params.force)
        },

        insertCourtCasesWithCourtNames(params: { courtNames: string[]; force: string }) {
          return insertCourtCasesWithCourtNames(params.courtNames, params.force)
        },

        insertCourtCasesWithDefendantNames(params: { defendantNames: string[]; force: string }) {
          return insertCourtCasesWithDefendantNames(params.defendantNames, params.force)
        },

        insertDummyCourtCaseWithLock(params: {
          errorLockedById: string
          triggerLockedById: string
          orgCodes: string[]
        }) {
          return insertDummyCourtCaseWithLock(params.errorLockedById, params.triggerLockedById, params.orgCodes)
        },

        insertCourtCases(params: { courtCases: CourtCase[] }) {
          return insertCourtCases(params.courtCases)
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

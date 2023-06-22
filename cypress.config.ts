import { defineConfig } from "cypress"
import pgPromise from "pg-promise"
import CourtCase from "./src/services/entities/CourtCase"
import User from "./src/services/entities/User"
import deleteFromEntity from "./test/utils/deleteFromEntity"
import { getCourtCaseById } from "./test/utils/getCourtCaseById"
import {
  insertCourtCasesWithFields,
  insertDummyCourtCasesWithNotes,
  insertDummyCourtCasesWithNotesAndLock,
  insertMultipleDummyCourtCases,
  insertDummyCourtCasesWithTriggers
} from "./test/utils/insertCourtCases"

import createAuditLog from "./test/helpers/createAuditLog"
import insertException from "./test/utils/manageExceptions"
import { deleteTriggers, insertTriggers } from "./test/utils/manageTriggers"
import { deleteUsers, insertUsersWithOverrides } from "./test/utils/manageUsers"
import { ResolutionStatus } from "types/ResolutionStatus"

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4080", // Default value: We can override this in package.json
    setupNodeEvents(on, _) {
      const pgp = pgPromise()
      const db = pgp("postgres://bichard:password@localhost:5432/bichard")

      on("task", {
        async getVerificationCode(emailAddress: string): Promise<string> {
          const result = await db
            .one("SELECT email_verification_code FROM br7own.users WHERE email = $1", emailAddress)
            .catch(console.error)

          return result.email_verification_code
        },
        async insertIntoUserGroup(params: { emailAddress: string; groupName: string }): Promise<null> {
          const updateUserGroup = async () => {
            const insertQuery = `
              INSERT INTO 
                br7own.users_groups(
                  group_id, 
                  user_id
                ) VALUES (
                  (SELECT id FROM br7own.groups WHERE name=$1 LIMIT 1),
                  (SELECT id FROM br7own.users WHERE email=$2 LIMIT 1)
                )
            `
            await db.none(insertQuery, [params.groupName, params.emailAddress]).catch(console.error)
          }
          await updateUserGroup()

          return null
        },

        insertMultipleDummyCourtCases(params: { numToInsert: number; force: string }) {
          return insertMultipleDummyCourtCases(params.numToInsert, params.force)
        },

        insertDummyCourtCasesWithTriggers(params: {
          caseTriggers: { code: string; status: ResolutionStatus }[][]
          orgCode: string
          triggersLockedByUsername?: string
        }) {
          return insertDummyCourtCasesWithTriggers(params.caseTriggers, params.orgCode, params.triggersLockedByUsername)
        },

        insertCourtCasesWithFields(cases: Partial<CourtCase>[]) {
          return insertCourtCasesWithFields(cases)
        },

        insertCourtCasesWithNotes(params: { caseNotes: { user: string; text: string }[][]; force: string }) {
          return insertDummyCourtCasesWithNotes(params.caseNotes, params.force)
        },

        insertCourtCasesWithNotesAndLock(params: { caseNotes: { user: string; text: string }[][]; force: string }) {
          return insertDummyCourtCasesWithNotesAndLock(params.caseNotes, params.force)
        },

        clearCourtCases() {
          return deleteFromEntity(CourtCase)
        },

        createAuditLog(messageId: string) {
          return createAuditLog(messageId)
        },

        insertUsers(params: { users: Partial<User>[]; userGroups?: string[] }) {
          return insertUsersWithOverrides(params.users, params.userGroups)
        },

        clearUsers() {
          return deleteUsers().then(() => true)
        },

        insertTriggers(args) {
          return insertTriggers(args.caseId, args.triggers)
        },

        clearTriggers() {
          return deleteTriggers().then(() => true)
        },

        insertException(params: { caseId: number; exceptionCode: string; errorReport?: string }) {
          return insertException(params.caseId, params.exceptionCode, params.errorReport)
        },
        getCourtCaseById(params: { caseId: number }) {
          return getCourtCaseById(params.caseId)
        },
        table(message) {
          console.table(message)
          return null
        }
      })
    }
  },

  chromeWebSecurity: false,
  video: false,

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack"
    }
  }
})

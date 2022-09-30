/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { defineConfig } from "cypress"
import CourtCase from "./src/services/entities/CourtCase"
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
import { deleteUsers, insertUsersWithOverrides } from "./test/util/manageUsers"
import User from "./src/services/entities/User"
import pgPromise from "pg-promise"

export default defineConfig({
  e2e: {
    baseUrl: "https://" + "localhost:4443",
    setupNodeEvents(on, _config) {
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
            await db.one(insertQuery, [params.groupName, params.emailAddress]).catch(console.error)
          }
          await updateUserGroup()

          return null
        },
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
          errorLockedByUsername: string
          triggerLockedByUsername: string
          orgCodes: string[]
        }) {
          return insertDummyCourtCaseWithLock(
            params.errorLockedByUsername,
            params.triggerLockedByUsername,
            params.orgCodes
          )
        },

        insertCourtCases(params: { courtCases: CourtCase[] }) {
          return insertCourtCases(params.courtCases)
        },

        clearCourtCases() {
          return deleteFromTable(CourtCase)
        },

        insertUsers(users: Partial<User>[]) {
          return insertUsersWithOverrides(users)
        },

        clearUsers() {
          return deleteUsers().then(() => true)
        },

        insertTriggers(args) {
          return insertTriggers(args.caseId, args.triggers)
        },

        insertException(params: { caseId: number; exceptionCode: string }) {
          return insertException(params.caseId, params.exceptionCode)
        },
        table(message) {
          console.table(message)
          return null
        }
      })
    }
  },
  chromeWebSecurity: false,
  video: false
})

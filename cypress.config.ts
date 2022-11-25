import { defineConfig } from "cypress"
import CourtCase from "./src/services/entities/CourtCase"
import deleteFromTable from "./test/utils/deleteFromTable"
import {
  insertCourtCases,
  insertCourtCasesWithCourtNames,
  insertCourtCasesWithDefendantNames,
  insertCourtCasesWithOrgCodes,
  insertMultipleDummyCourtCases,
  insertDummyCourtCaseWithLock,
  insertDummyCourtCasesWithUrgencies,
  insertDummyCourtCasesWithNotes,
  insertCourtCasesWithCourtDates,
  insertMultipleDummyCourtCasesWithLock
} from "./test/utils/insertCourtCases"
import { getCourtCaseById } from "./test/utils/getCourtCaseById"
import { insertTriggers } from "./test/utils/manageTriggers"
import insertException from "./test/utils/manageExceptions"
import { deleteUsers, insertUsersWithOverrides } from "./test/utils/manageUsers"
import User from "./src/services/entities/User"
import pgPromise from "pg-promise"

export default defineConfig({
  e2e: {
    experimentalSessionAndOrigin: true,
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

        insertCourtCasesWithCourtDates(params: { courtDate: Date[]; force: string }) {
          return insertCourtCasesWithCourtDates(params.courtDate, params.force)
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

        insertMultipleDummyCourtCasesWithLock(params: {
          lockHolders: { errorLockedByUsername?: string; triggerLockedByUsername?: string }[]
          orgCode: string
        }) {
          return insertMultipleDummyCourtCasesWithLock(params.lockHolders, params.orgCode)
        },

        insertCourtCasesWithUrgencies(params: { urgencies: boolean[]; force: string }) {
          return insertDummyCourtCasesWithUrgencies(params.urgencies, params.force)
        },

        insertCourtCasesWithNotes(params: { caseNotes: { user: string; text: string }[][]; force: string }) {
          return insertDummyCourtCasesWithNotes(params.caseNotes, params.force)
        },

        insertCourtCases(params: { courtCases: CourtCase[] }) {
          return insertCourtCases(params.courtCases)
        },

        clearCourtCases() {
          return deleteFromTable(CourtCase)
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

        insertException(params: { caseId: number; exceptionCode: string }) {
          return insertException(params.caseId, params.exceptionCode)
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
  video: false
})

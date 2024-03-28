import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import User from "services/entities/User"
import hashedPassword from "../../../fixtures/hashedPassword"
import { clickTab } from "../../../support/helpers"

describe("View offence matching exceptions", () => {
  const users: Partial<User>[] = Array.from(Array(5)).map((_value, idx) => {
    return {
      username: `Bichard0${idx}`,
      visibleForces: [`0${idx}`],
      forenames: "Bichard Test User",
      surname: `0${idx}`,
      email: `bichard0${idx}@example.com`,
      password: hashedPassword
    }
  })

  before(() => {
    cy.task("clearCourtCases")
    cy.task("clearUsers")
    cy.task("insertUsers", { users, userGroups: ["B7NewUI_grp"] })
    cy.task("insertIntoUserGroup", { emailAddress: "bichard01@example.com", groupName: "B7GeneralHandler_grp" })
    cy.task("insertIntoUserGroup", { emailAddress: "bichard02@example.com", groupName: "B7Supervisor_grp" })
    cy.clearCookies()
  })

  beforeEach(() => {
    cy.task("clearCourtCases")
  })
  ;[
    { asn: ExceptionCode.HO100304, firstOffenceBadge: "Unmatched" },
    { asn: ExceptionCode.HO100328, firstOffenceBadge: "Unmatched" },
    { asn: ExceptionCode.HO100507, firstOffenceBadge: "Added by Court", secondOffenceBadge: "Added by Court" },
    { offenceReasonSequence: ExceptionCode.HO100203 },
    { offenceReasonSequence: ExceptionCode.HO100228 },
    { offenceReasonSequence: ExceptionCode.HO100310 },
    { offenceReasonSequence: ExceptionCode.HO100311 },
    { offenceReasonSequence: ExceptionCode.HO100312 },
    { offenceReasonSequence: ExceptionCode.HO100320 },
    { offenceReasonSequence: ExceptionCode.HO100329 },
    { offenceReasonSequence: ExceptionCode.HO100332 },
    { offenceReasonSequence: ExceptionCode.HO100333 }
  ].forEach(({ asn, offenceReasonSequence, firstOffenceBadge = "Matched", secondOffenceBadge = "Unmatched" }) => {
    it(`Should display the correct error for ${asn ?? offenceReasonSequence}`, () => {
      cy.task("insertCourtCaseWithFieldsWithExceptions", {
        case: {
          errorLockedByUsername: null,
          triggerLockedByUsername: null,
          orgForPoliceFilter: "02"
        },
        exceptions: {
          asn,
          offenceReasonSequence
        }
      })

      cy.login("bichard02@example.com", "password")
      cy.visit("/bichard/court-cases/0")

      clickTab("Offences")

      cy.get("tbody tr:nth-child(1) td:nth-child(5) a").click()

      cy.contains("h3", "Offence 1 of 2")
      cy.contains("td", "Offence code").siblings().contains("TH68010")
      cy.contains("td", "PNC sequence number").siblings().contains(firstOffenceBadge)

      cy.get("button").contains("Next offence").click()
      cy.contains("h3", "Offence 2 of 2")
      cy.contains("td", "Offence code").siblings().contains("TH68010")
      cy.contains("td", "PNC sequence number").siblings().contains(secondOffenceBadge)
    })
  })
})

export {}

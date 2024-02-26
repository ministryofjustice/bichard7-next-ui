import User from "services/entities/User"
import hashedPassword from "../../../fixtures/hashedPassword"
import { clickTab } from "../../../support/helpers"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"

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
    { asn: ExceptionCode.HO100304, badge: "Unmatched" },
    { asn: ExceptionCode.HO100328, badge: "Unmatched" },
    { asn: ExceptionCode.HO100507, badge: "Added by Court" },
    { offenceReasonSequence: ExceptionCode.HO100203, badge: "Unmatched" },
    { offenceReasonSequence: ExceptionCode.HO100228, badge: "Unmatched" },
    { offenceReasonSequence: ExceptionCode.HO100310, badge: "Unmatched" },
    { offenceReasonSequence: ExceptionCode.HO100311, badge: "Unmatched" },
    { offenceReasonSequence: ExceptionCode.HO100312, badge: "Unmatched" },
    { offenceReasonSequence: ExceptionCode.HO100320, badge: "Unmatched" },
    { offenceReasonSequence: ExceptionCode.HO100329, badge: "Unmatched" },
    { offenceReasonSequence: ExceptionCode.HO100332, badge: "Unmatched" },
    { offenceReasonSequence: ExceptionCode.HO100333, badge: "Unmatched" }
  ].forEach(({ offenceReasonSequence, asn, badge }) => {
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

      cy.get("tbody tr:nth-child(1) td:nth-child(4) a").click()

      cy.contains("h2", "Offence 1 of 2")
      cy.contains("td", "Offence code").siblings().contains("TH68010")
      cy.contains("td", "PNC sequence number").siblings().contains(badge)
    })
  })
})

export {}

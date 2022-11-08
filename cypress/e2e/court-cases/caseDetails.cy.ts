import type { TestTrigger } from "../../../test/utils/manageTriggers"
import { differenceInMinutes, parse } from "date-fns"
import User from "services/entities/User"
import logAccessibilityViolations from "../../support/logAccessibilityViolations"
import a11yConfig from "../../support/a11yConfig"
import hashedPassword from "../../fixtures/hashedPassword"

describe("Case details", () => {
  context("720p resolution", () => {
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
      cy.task("insertUsers", users)
      cy.task("insertIntoUserGroup", { emailAddress: "bichard01@example.com", groupName: "B7TriggerHandler_grp" })
      cy.task("insertIntoUserGroup", { emailAddress: "bichard02@example.com", groupName: "B7GeneralHandler_grp" })
      cy.clearCookies()
      cy.viewport(1280, 720)
    })

    beforeEach(() => {
      cy.task("clearCourtCases")
    })

    it("should be accessible", () => {
      cy.task("insertCourtCasesWithOrgCodes", ["01"])
      const triggers: TestTrigger[] = [
        {
          triggerId: 0,
          triggerCode: "TRPR0001",
          status: "Unresolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        }
      ]
      cy.task("insertTriggers", { caseId: 0, triggers })
      cy.login("bichard01@example.com", "password")

      cy.visit("/bichard/court-cases/0")

      cy.injectAxe()

      cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
    })

    it("should load case details for the case that this user can see", () => {
      cy.task("insertCourtCasesWithOrgCodes", ["01"])
      const triggers: TestTrigger[] = [
        {
          triggerId: 0,
          triggerCode: "TRPR0001",
          status: "Unresolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        }
      ]
      cy.task("insertTriggers", { caseId: 0, triggers })

      cy.login("bichard01@example.com", "password")

      cy.visit("/bichard/court-cases/0")

      cy.get("H2").should("have.text", "Case Details")

      // Case details table
      cy.get("th")
        .contains("PTIURN")
        .then(($cell) => {
          expect($cell.parent().find("td").text()).to.equal("Case00000")
        })
      cy.get("th")
        .contains("Court name")
        .then(($cell) => {
          expect($cell.parent().find("td").text()).to.equal("Magistrates' Courts Essex Basildon")
        })
      cy.get("th")
        .contains("Court date")
        .then(($cell) => {
          expect($cell.parent().find("td").text()).to.equal("26/09/2008")
        })
      cy.get("th")
        .contains("Defendant name")
        .then(($cell) => {
          expect($cell.parent().find("td").text()).to.equal("Allocation Trigger")
        })
      cy.get("th")
        .contains("Trigger reason")
        .then(($cell) => {
          expect($cell.parent().find("td").text()).to.equal("TRPR0001")
        })

      // Data from AHO XML
      cy.get("th")
        .contains("Organisation Unit Code")
        .then(($cell) => {
          expect($cell.parent().find("td").text()).to.equal("B41ME00")
        })

      // Triggers table
      cy.get("H3").contains("Triggers")
      cy.get("table").eq(-1).find("tr").should("have.length", 2)
      cy.get("table").eq(-1).find("tr").eq(1).find("td").first().should("have.text", "TRPR0001")
      cy.get("table").eq(-1).find("tr").eq(1).find("td").eq(4).should("have.text", "09/07/2022 12:22:34")

      // Notes
      cy.get("H3").contains("Notes")
      cy.get("p").contains("Case has no notes.")

      // Urgency
      cy.get("th")
        .contains("Urgency")
        .then(($cell) => {
          expect($cell.parent().find("td").text()).to.equal("Urgent")
        })
    })

    it("should return 404 for a case that this user can not see", () => {
      cy.task("insertCourtCasesWithOrgCodes", ["02"])
      cy.login("bichard01@example.com", "password")

      cy.request({
        failOnStatusCode: false,
        url: "/bichard/court-cases/0"
      }).then((response) => {
        expect(response.status).to.eq(404)
      })
    })

    it("should return 404 for a case that does not exist", () => {
      cy.login("bichard01@example.com", "password")

      cy.request({
        failOnStatusCode: false,
        url: "/court-cases/1"
      }).then((response) => {
        expect(response.status).to.eq(404)
      })
    })

    it("should redirect to the user-service if the auth token provided is for a non-existent user", () => {
      cy.login("bichard01@example.com", "password")
      cy.clearCookies()
      cy.visit("/bichard/court-cases/0")

      cy.url().should("match", /\/users/)
    })

    it("should lock a case when a user views a case details page", () => {
      cy.task("insertDummyCourtCaseWithLock", {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        orgCodes: ["02"],
        errorCount: 1,
        triggerCount: 1
      })

      cy.login("bichard02@example.com", "password")
      cy.visit("/bichard/court-cases/0")

      cy.findByText("Lock Court Case").click()
      cy.findByText("Case locked by another user").should("not.exist")
      cy.findByText("Trigger locked by: Bichard02").should("exist")
      cy.findByText("Error locked by: Bichard02").should("exist")
    })

    it("should not lock a court case when its already locked", () => {
      const existingUserLock = "Another name"
      cy.task("insertDummyCourtCaseWithLock", {
        errorLockedByUsername: existingUserLock,
        triggerLockedByUsername: existingUserLock,
        orgCodes: ["01"],
        errorCount: 1,
        triggerCount: 1
      })

      cy.login("bichard01@example.com", "password")
      cy.visit("/bichard/court-cases/0")
      cy.findByText("Case locked by another user").should("exist")
      cy.findByText("Trigger locked by: Another name").should("exist")
      cy.findByText("Error locked by: Another name").should("exist")
    })

    it("should unlock and lock a court case when its already locked", () => {
      const existingUserLock = "Another name"
      cy.task("insertDummyCourtCaseWithLock", {
        errorLockedByUsername: existingUserLock,
        triggerLockedByUsername: existingUserLock,
        orgCodes: ["02"]
      })

      cy.login("bichard02@example.com", "password")
      cy.visit("/bichard/court-cases/0")
      cy.findByText("Case locked by another user").should("exist")
      cy.findByText("Trigger locked by: Another name").should("exist")
      cy.findByText("Error locked by: Another name").should("exist")

      cy.findByText("Unlock Court Case").click()
      cy.findByText("Case locked by another user").should("not.exist")
      cy.findByText("Trigger locked by: Another name").should("not.exist")
      cy.findByText("Error locked by: Another name").should("not.exist")

      cy.findByText("Lock Court Case").click()
      cy.findByText("Case locked by another user").should("not.exist")
      cy.findByText("Trigger locked by: Bichard02").should("exist")
      cy.findByText("Error locked by: Bichard02").should("exist")
    })

    it("should resolve a trigger after clicking the button", () => {
      const userWithGeneralHandlerPermission = "Bichard02"
      cy.task("insertDummyCourtCaseWithLock", {
        errorLockedByUsername: userWithGeneralHandlerPermission,
        triggerLockedByUsername: userWithGeneralHandlerPermission,
        orgCodes: ["02"]
      })
      const triggers: TestTrigger[] = [
        {
          triggerId: 0,
          triggerCode: "TRPR0001",
          status: "Unresolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        }
      ]
      cy.task("insertTriggers", { caseId: 0, triggers })

      cy.login("bichard02@example.com", "password")
      cy.visit("/bichard/court-cases/0")
      cy.findByText(`Trigger locked by: ${userWithGeneralHandlerPermission}`).should("exist")
      cy.findByText(`Error locked by: ${userWithGeneralHandlerPermission}`).should("exist")

      cy.get("button").contains("Resolve trigger").click()
      cy.get("table")
        .eq(-1)
        .then((table) => {
          expect(table.find("td").eq(2).text()).to.equal(userWithGeneralHandlerPermission)
          const resolutionTime = parse(table.find("td").eq(3).text(), "dd/MM/yyyy HH:mm:ss", new Date())
          const minsSinceResolved = differenceInMinutes(new Date(), resolutionTime)
          expect(minsSinceResolved).to.be.at.least(0)
          expect(minsSinceResolved).to.be.below(1)
        })
    })

    it("should resubmit a case when the resubmit button is clicked", () => {
      cy.task("insertDummyCourtCaseWithLock", {
        errorLockedByUsername: null,
        triggerLockedByUsername: null,
        orgCodes: ["02"]
      })

      cy.login("bichard02@example.com", "password")

      cy.visit("/bichard/court-cases/0")

      cy.get("button").contains("Resubmit").click()
      cy.location().should((loc) => {
        expect(loc.href).to.contain("?courtCaseId=0&resubmitCase=true")
      })

      cy.get("H2").should("have.text", "Case Details")
      const dateTimeRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/
      cy.get("table").eq(-1).find("tr").eq(0).find("td").first().contains(dateTimeRegex)
      cy.get("table")
        .eq(-1)
        .find("tr")
        .eq(0)
        .find("td")
        .last()
        .should("have.text", "Bichard02: Portal Action: Resubmitted Message.")
    })
  })
})

export {}

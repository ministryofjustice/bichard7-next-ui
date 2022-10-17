import type { TestTrigger } from "../../../test/util/manageTriggers"
import { differenceInMinutes, parse } from "date-fns"
import User from "services/entities/User"
import logAccessibilityViolations from "../../support/logAccessibilityViolations"
import a11yConfig from "../../support/a11yConfig"

describe("Case details", () => {
  context("720p resolution", () => {
    const users: Partial<User>[] = Array.from(Array(5)).map((_value, idx) => {
      return {
        username: `Bichard0${idx}`,
        visibleForces: [`0${idx}`],
        forenames: "Bichard Test User",
        surname: `0${idx}`,
        email: `bichard0${idx}@example.com`,
        password:
          "$argon2id$v=19$m=256,t=20,p=2$TTFCN3BRcldZVUtGejQ3WE45TGFqPT0$WOE+jDILDnVIAt1dytb+h65uegrMomp2xb0Q6TxbkLA"
      }
    })

    beforeEach(() => {
      cy.task("clearCourtCases")
      cy.task("clearUsers")
      cy.task("insertUsers", users)
      cy.clearCookies()
      cy.viewport(1280, 720)
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
      cy.task("insertIntoUserGroup", { emailAddress: "bichard01@example.com", groupName: "B7TriggerHandler_grp" })

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

      cy.request({
        failOnStatusCode: false,
        url: "/court-cases/1"
      }).then(() => {
        cy.url().should("match", /\/users/)
      })
    })

    it("should lock a case when a user views a case details page", () => {
      cy.task("insertCourtCasesWithOrgCodes", ["01"])
      cy.task("insertIntoUserGroup", { emailAddress: "bichard01@example.com", groupName: "B7GeneralHandler_grp" })
      cy.login("bichard01@example.com", "password")
      cy.visit("/bichard/court-cases/0")

      cy.findByText("Lock Court Case").click()
      cy.findByText("Case locked by another user").should("not.exist")
      cy.findByText("Trigger locked by: Bichard01").should("exist")
      cy.findByText("Error locked by: Bichard01").should("exist")
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
        orgCodes: ["01"]
      })
      cy.task("insertIntoUserGroup", { emailAddress: "bichard01@example.com", groupName: "B7GeneralHandler_grp" })

      cy.login("bichard01@example.com", "password")
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
      cy.findByText("Trigger locked by: Bichard01").should("exist")
      cy.findByText("Error locked by: Bichard01").should("exist")
    })

    it("should resolve a trigger after clicking the button", () => {
      const user = "Bichard01"
      cy.task("insertDummyCourtCaseWithLock", {
        errorLockedByUsername: user,
        triggerLockedByUsername: user,
        orgCodes: ["01"]
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
      cy.task("insertIntoUserGroup", { emailAddress: "bichard01@example.com", groupName: "B7GeneralHandler_grp" })

      cy.login("bichard01@example.com", "password")
      cy.visit("/bichard/court-cases/0")
      cy.findByText(`Trigger locked by: ${user}`).should("exist")
      cy.findByText(`Error locked by: ${user}`).should("exist")

      cy.get("button").contains("Resolve trigger").click()
      cy.get("table")
        .eq(-1)
        .then((table) => {
          expect(table.find("td").eq(2).text()).to.equal(user)
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
        orgCodes: ["01"]
      })

      cy.login("bichard01@example.com", "password")
      cy.task("insertIntoUserGroup", { emailAddress: "bichard01@example.com", groupName: "B7GeneralHandler_grp" })

      cy.visit("/bichard/court-cases/0")

      cy.get("button").contains("Resubmit").click()
      cy.location().should((loc) => {
        expect(loc.href).to.contain("?courtCaseId=0&resubmitCase=true")
      })
    })
  })
})

export {}

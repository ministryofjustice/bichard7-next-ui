import type { TestUser } from "../../../test/util/manageUsers"
import type { TestTrigger } from "../../../test/util/manageTriggers"

describe("Home", () => {
  context("720p resolution", () => {
    const users: TestUser[] = Array.from(Array(5)).map((_value, idx) => {
      return {
        username: `Bichard0${idx}`,
        visibleForces: [`0${idx}`],
        forenames: "Bichard Test User",
        surname: `0${idx}`,
        email: `bichard0${idx}@example.com`
      }
    })

    beforeEach(() => {
      cy.task("clearCourtCases")
      cy.task("clearUsers")
      cy.task("insertUsers", users)
      cy.clearCookies()
      cy.setAuthCookie("Bichard01")
      cy.viewport(1280, 720)
    })

    it("should load case details for the case that this user can see", () => {
      cy.task("insertCourtCasesWithOrgCodes", ["01"])
      const triggers: TestTrigger[] = [
        {
          triggerId: 0,
          triggerCode: "TRPR0001",
          status: 0,
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        }
      ]
      cy.task("insertTriggers", { caseId: 0, triggers })
      cy.visit("/court-cases/0")

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
      cy.get("table").eq(1).find("tr").should("have.length", 2)
      cy.get("table").eq(1).find("tr").eq(1).find("td").first().should("have.text", "TRPR0001")
      cy.get("table").eq(1).find("tr").eq(1).find("td").last().should("have.text", "09/07/2022 11:22:34")

      // Notes
      cy.get("H3").contains("Notes")
      cy.get("p").contains("Case has no notes.")
    })

    it("should return 404 for a case that this user can not see", () => {
      cy.task("insertCourtCasesWithOrgCodes", ["02"])

      cy.request({
        failOnStatusCode: false,
        url: "/court-cases/0"
      }).then((response) => {
        expect(response.status).to.eq(404)
      })
    })

    it("should return 404 for a case that does not exist", () => {
      cy.request({
        failOnStatusCode: false,
        url: "/court-cases/1"
      }).then((response) => {
        expect(response.status).to.eq(404)
      })
    })

    it("should return 401 if the auth token provided is for a non-existent user", () => {
      cy.clearCookies()
      cy.setAuthCookie("InvalidUser")

      cy.request({
        failOnStatusCode: false,
        url: "/court-cases/1"
      }).then((response) => {
        expect(response.status).to.eq(401)
      })
    })

    it("should lock a case when a user views a case details page", () => {
      cy.task("insertCourtCasesWithOrgCodes", ["01"])

      cy.visit("/court-cases/0?lock=true")
      cy.findByText("Case locked by another user").should("not.exist")
      cy.findByText("Trigger locked by: Bichard01").should("exist")
      cy.findByText("Error locked by: Bichard01").should("exist")
    })

    it("should not lock a court case when its already locked", async () => {
      const existingUserLock = "Another name"
      cy.task("insertDummyCourtCaseWithLock", {
        errorLockedById: existingUserLock,
        triggerLockedById: existingUserLock
      })

      cy.visit("/court-cases/0?lock=true")
      cy.findByText("Case locked by another user").should("exist")
      cy.findByText("Trigger locked by: Another name").should("exist")
      cy.findByText("Error locked by: Another name").should("exist")
    })

    it("should unlock and lock a court case when its already locked", () => {
      const existingUserLock = "Another name"
      const existingCourtCases = [
        {
          ...CourtCaseCase,
          annotated_msg: CourtCaseAho.annotated_msg,
          court_date: "2008-09-25",
          org_for_police_filter: "01",
          error_id: "0",
          message_id: String(0).padStart(5, "x"),
          error_locked_by_id: existingUserLock,
          trigger_locked_by_id: existingUserLock
        }
      ]

      cy.task("insertCourtCases", { courtCases: existingCourtCases })

      cy.visit("/court-cases/0")
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
  })
})

export {}

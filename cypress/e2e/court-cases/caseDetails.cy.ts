import type { TestTrigger } from "../../../test/utils/manageTriggers"
import { differenceInMinutes, parse } from "date-fns"
import User from "services/entities/User"
import logAccessibilityViolations from "../../support/logAccessibilityViolations"
import a11yConfig from "../../support/a11yConfig"
import hashedPassword from "../../fixtures/hashedPassword"
import resubmitCaseJson from "../../fixtures/expected_resubmit_01.json"
import { Tabs } from "../../../src/features/CourtCaseDetails/Tabs/CourtCaseDetailsTabs"

const clickTab = (tab: Tabs) => {
  cy.contains(tab).click()
  cy.get("H4").contains(tab)
}

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
      cy.task("insertUsers", { users, userGroups: ["B7NewUI_grp"] })
      cy.task("insertIntoUserGroup", { emailAddress: "bichard01@example.com", groupName: "B7TriggerHandler_grp" })
      cy.task("insertIntoUserGroup", { emailAddress: "bichard02@example.com", groupName: "B7Supervisor_grp" })
      cy.clearCookies()
      cy.viewport(1280, 720)
    })

    beforeEach(() => {
      cy.task("clearCourtCases")
    })

    it("should be accessible", () => {
      cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
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

      // Wait for the page to fully load
      cy.get("h1")

      cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
    })

    it("should load case details for the case that this user can see", () => {
      cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])
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

      cy.get("H2").should("have.text", "Case details")

      cy.contains("Case00000")
      cy.contains("Magistrates' Courts Essex Basildon")

      cy.get("th")
        .contains("Court date")
        .then(($cell) => {
          expect($cell.parent().find("td").text()).to.equal("26/09/2008")
        })

      cy.contains("NAME Defendant")

      cy.get("th")
        .contains("Trigger reason")
        .then(($cell) => {
          expect($cell.parent().find("td").text()).to.equal("TRPR0001")
        })

      // Data from AHO XML
      cy.get("th")
        .contains("Organisation Unit Code")
        .then(($cell) => {
          expect($cell.parent().find("td").text()).to.equal("B01EF01")
        })

      // Triggers table
      cy.get("H3").contains("Triggers")
      cy.get("table").eq(-1).find("tr").should("have.length", 2)
      cy.get("table").eq(-1).find("tr").eq(1).find("td").first().should("have.text", "TRPR0001")
      cy.get("table").eq(-1).find("tr").eq(1).find("td").eq(4).should("include.text", "09/07/2022")

      // Notes
      cy.get("H3").contains("Notes")
      cy.get("p").contains("Case has no notes.")

      // Urgency
      cy.contains("Urgent")
    })

    it("should allow to click through the tabs", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          errorLockedByUsername: null,
          triggerLockedByUsername: null,
          orgForPoliceFilter: "02"
        }
      ])
      cy.login("bichard02@example.com", "password")
      cy.visit("/bichard/court-cases/0")

      clickTab("Defendant")
      clickTab("Hearing")
      clickTab("Case information")
      clickTab("Offences")
      clickTab("Notes")
      clickTab("PNC errors")
    })

    it("should display the content of the Hearing tab", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          errorLockedByUsername: null,
          triggerLockedByUsername: null,
          orgForPoliceFilter: "02"
        }
      ])
      cy.login("bichard02@example.com", "password")
      cy.visit("/bichard/court-cases/0")

      clickTab("Hearing")
      cy.contains("B01EF01")
      cy.contains("26/09/2011")
      cy.contains("10:00")
      cy.contains("A")
      cy.contains("SPI TRPRFOUR SEXOFFENCE")
      cy.contains("CID-8bc6ee0a-46ac-4a0e-b9be-b03e3b041415")
      cy.contains("SPI Case Result")
      cy.contains("MCA (MC adult)")
      cy.contains("2576")
      cy.contains("London Croydon")
      cy.contains("D (Don't know)")
    })

    it("should return 404 for a case that this user can not see", () => {
      cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "02" }])
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

    it.skip("should redirect to the user-service if the auth token provided is for a non-existent user", () => {
      cy.login("bichard01@example.com", "password")
      cy.clearCookies()
      cy.visit("/bichard/court-cases/0", { failOnStatusCode: false })

      cy.url().should("match", /\/users/)
    })

    it("should lock a case when a user views a case details page", () => {
      cy.task("insertCourtCasesWithFields", [
        {
          errorLockedByUsername: null,
          triggerLockedByUsername: null,
          orgForPoliceFilter: "02",
          errorCount: 1,
          triggerCount: 1
        }
      ])

      cy.login("bichard02@example.com", "password")
      cy.visit("/bichard/court-cases/0")

      cy.findByText("Lock Court Case").click()
      cy.findByText("Case locked by another user").should("not.exist")
      cy.findByText("Trigger locked by: Bichard02").should("exist")
      cy.findByText("Error locked by: Bichard02").should("exist")
    })

    it("should not lock a court case when its already locked", () => {
      const existingUserLock = "Another name"
      cy.task("insertCourtCasesWithFields", [
        {
          errorLockedByUsername: existingUserLock,
          triggerLockedByUsername: existingUserLock,
          orgForPoliceFilter: "01",
          errorCount: 1,
          triggerCount: 1
        }
      ])

      cy.login("bichard01@example.com", "password")
      cy.visit("/bichard/court-cases/0")
      cy.findByText("Case locked by another user").should("exist")
      cy.findByText("Trigger locked by: Another name").should("exist")
      cy.findByText("Error locked by: Another name").should("exist")
    })

    it("should unlock and lock a court case when its already locked", () => {
      const existingUserLock = "Another name"
      cy.task("insertCourtCasesWithFields", [
        {
          errorLockedByUsername: existingUserLock,
          triggerLockedByUsername: existingUserLock,
          orgForPoliceFilter: "02",
          errorCount: 1,
          triggerCount: 1
        }
      ])

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
      cy.task("insertCourtCasesWithFields", [
        {
          errorLockedByUsername: userWithGeneralHandlerPermission,
          triggerLockedByUsername: userWithGeneralHandlerPermission,
          orgForPoliceFilter: "02"
        }
      ])

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
      cy.task("insertCourtCasesWithFields", [
        {
          errorLockedByUsername: null,
          triggerLockedByUsername: null,
          orgForPoliceFilter: "02"
        }
      ])

      cy.login("bichard02@example.com", "password")

      cy.visit("/bichard/court-cases/0")

      cy.get("button").contains("Resubmit").click()
      cy.location().should((loc) => {
        expect(loc.href).to.contain("?courtCaseId=0&resubmitCase=true")
      })

      cy.get("H2").should("have.text", "Case details")
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

    it("should resubmit a case when updates are made and the resubmit button is clicked", () => {
      cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "02" }])
      cy.login("bichard02@example.com", "password")

      cy.visit("/bichard/court-cases/0")

      // need to make the updates and then check them in the db
      cy.get("input").first().type("2024-09-26")

      cy.get("button")
        .contains("Resubmit")
        .click()
        .then(() => {
          cy.task("getCourtCaseById", { caseId: 0 }).then((res) =>
            expect(JSON.stringify(res)).to.eq(JSON.stringify(resubmitCaseJson))
          )
        })
      cy.location().should((loc) => {
        expect(loc.href).to.contain("?courtCaseId=0&resubmitCase=true")
      })

      cy.get("H2").should("have.text", "Case details")
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

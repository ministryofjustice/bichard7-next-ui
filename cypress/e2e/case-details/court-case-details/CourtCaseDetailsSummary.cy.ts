import CourtCase from "services/entities/CourtCase"
import dummyAho from "../../../../test/test-data/error_list_aho.json"
import { TestTrigger } from "../../../../test/utils/manageTriggers"
import { defaultSetup } from "../../../support/helpers"

describe("Court Case Details Summary Box", () => {
  const trigger: TestTrigger = {
    triggerId: 0,
    triggerCode: "TRPR0001",
    status: "Unresolved",
    createdAt: new Date("2022-07-09T10:22:34.000Z")
  }

  const exception = {
    caseId: 0,
    exceptionCode: "HO100310",
    errorReport: "HO100310||ds:OffenceReasonSequence"
  }

  const insertCaseWithTriggerAndException = (courtCase?: Partial<CourtCase>) => {
    cy.task("insertCourtCasesWithFields", [
      courtCase ?? {
        ptiurn: "ptirn-value",
        asn: "asn-value",
        courtReference: "cRef-value",
        courtName: "cName-value",
        orgForPoliceFilter: "01",
        hearingOutcome: dummyAho.hearingOutcomeXml.replace("9625UC0000000118191Z", "asn-value")
      }
    ])
    cy.task("insertTriggers", { caseId: 0, triggers: [trigger] })
    cy.task("insertException", exception)
  }

  before(() => {
    defaultSetup()
    cy.task("clearCourtCases")
    cy.clearCookies()
  })

  it("displays the required fields", () => {
    insertCaseWithTriggerAndException()
    cy.login("bichard01@example.com", "password")
    cy.visit("/bichard/court-cases/0")

    cy.contains("ASN")
    cy.contains("asn-value")

    cy.contains("Court code (LJA)")
    cy.contains("1892")

    cy.contains("Court name")
    cy.contains("cName-value")

    cy.contains("Court name")
    cy.contains("cName-value")

    cy.contains("Court case reference")
    cy.contains("cRef-value")

    cy.contains("PNCID")
    cy.contains("2706/1234567P")

    cy.contains("PTIURN")
    cy.contains("ptirn-value")

    cy.contains("DOB")
    cy.contains("29/10/1949")

    cy.contains("Hearing date")
    cy.contains("11/01/2008")
  })
})

import resolvedAsnAho from "../../../fixtures/resolvedAsnAho.json"
import unresolvedAsnAho from "../../../fixtures/unResolvedAsnAho.json"

describe("reports API endpoint", () => {
  describe("GET /reports", () => {
    describe("without authentication", () => {
      it("returns a 401 status code", () => {
        cy.request({
          method: "GET",
          url: `/bichard/api/reports`,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.equal(401)
        })
      })
    })

    describe("with authentication", () => {
      beforeEach(() => {
        cy.loginAs("GeneralHandler")
        cy.task("insertCourtCasesWithFields", [
          {
            orgForPoliceFilter: "01",
            hearingOutcome: resolvedAsnAho.hearingOutcomeXml,
            updatedHearingOutcome: resolvedAsnAho.hearingOutcomeXml,
            errorCount: 1,
            errorLockedByUsername: "GeneralHandler",
            errorStatus: "Resolved",
            errorReport: "HO100321||ds:ArrestSummonsNumber",
            errorReason: "HO100321",
            errorResolvedBy: "GeneralHandler",
            defendantName: "WAYNE Bruce"
          },
          {
            orgForPoliceFilter: "01",
            hearingOutcome: unresolvedAsnAho.hearingOutcomeXml,
            updatedHearingOutcome: unresolvedAsnAho.hearingOutcomeXml,
            errorCount: 1,
            errorLockedByUsername: "GeneralHandler",
            errorReport: "HO100321||ds:ArrestSummonsNumber",
            errorReason: "HO100321",
            defendantName: "GORDON Barbara"
          }
        ])
      })

      it("returns a 200 status code", () => {
        cy.request({
          method: "GET",
          url: `/bichard/api/reports`
        }).then((response) => {
          expect(response.status).to.equal(200)
        })
      })

      it("returns a csv payload", () => {
        cy.request({
          method: "GET",
          url: `/bichard/api/reports?order=desc&orderBy=courtDate&reason=All&state=Resolved&lockedState=All`
        }).then((response) => {
          expect(response.status).to.equal(200)
          console.log(response.body)
          expect(response.body.report).to.equal(
            `ASN,PTIURN,defendantName,courtName,hearingDate,caseReference,dateTimeRecievedByCJSE,dateTimeResolved,notes,resolutionAction\n0836FP0100000377244A,Case00000,WAYNE Bruce,Magistrates' Courts Essex Basildon,,,,,[],`
          )
        })
      })
    })
  })
})

import resolvedAsnAho from "../../../fixtures/resolvedAsnAho.json"
import unresolvedAsnAho from "../../../fixtures/unResolvedAsnAho.json"

describe("reports API endpoint", () => {
  describe("GET /reports/*", () => {
    describe("without authentication", () => {
      it("returns a 401 status code", () => {
        cy.request({
          method: "GET",
          url: `/bichard/api/reports/resolved-exceptions`,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.equal(401)
        })
      })
    })
    describe("with authentication", () => {
      beforeEach(() => {
        cy.loginAs("GeneralHandler")
      })

      it("returns a 404 if unknown report-type", () => {
        cy.request({
          method: "GET",
          url: `/bichard/api/reports/not-a-report`,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.equal(404)
        })
      })
    })
  })

  describe("GET /reports/resolved-exceptions", () => {
    let date: Date
    beforeEach(() => {
      date = new Date("2024-09-26 10:44:14 UTC")
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
          defendantName: "WAYNE Bruce",
          resolutionTimestamp: date,
          messageReceivedTimestamp: date
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

    it("returns a 400 if resolved dates not included in query string", () => {
      cy.request({
        method: "GET",
        url: `/bichard/api/reports/resolved-exceptions`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(400)
      })
    })

    it("returns a csv payload", () => {
      const localOffset = date.getTimezoneOffset() * 60 * 1000
      const dateStamp = date.getTime() + localOffset
      const timeStamp = new Date(dateStamp).toISOString()
      cy.request({
        method: "GET",
        url: `/bichard/api/reports/resolved-exceptions?resolvedFrom=2024-09-20%2000:00:00&resolvedTo=2024-09-26%2022:59:59`
      }).then((response) => {
        expect(response.status).to.equal(200)
        console.log(response.body)
        expect(response.body.report).to.equal(
          `ASN,PTIURN,Defendant Name,Court Name,Hearing Date,Case Reference,Date/Time Received By CJSE,Date/Time Resolved,Notes,Resolution Action\n0836FP0100000377244A,Case00000,WAYNE Bruce,Magistrates' Courts Essex Basildon,,,${timeStamp},${timeStamp},[],`
        )
      })
    })
  })
})

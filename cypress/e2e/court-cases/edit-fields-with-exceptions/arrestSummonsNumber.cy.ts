import hashedPassword from "../../../fixtures/hashedPassword";
import asnExceptions from "../../../../test/test-data/AsnExceptionHo100206.json";
import dummyAho from "../../../../test/test-data/error_list_aho.json";
import {verifyUpdatedMessage} from "../../../support/helpers";

describe("NextHearingDate", () => {
    before(() => {
        cy.task("clearCourtCases")
        cy.task("clearUsers")
        cy.task("insertUsers", {
            users: [
                {
                    username: "Bichard01",
                    visibleForces: ["001"],
                    forenames: "Bichard Test User",
                    surname: "01",
                    email: "bichard01@example.com",
                    password: hashedPassword
                }
            ],
            userGroups: ["B7NewUI_grp", "B7GeneralHandler_grp"]
        })
    })

    beforeEach(() => {
        cy.task("clearCourtCases")
        cy.task("insertCourtCasesWithFields", [
            {
                orgForPoliceFilter: "01",
                hearingOutcome: asnExceptions.hearingOutcomeXml,
                updatedHearingOutcome: asnExceptions.updatedHearingOutcomeXml,
                errorCount: 1
            }
        ])
    })

    it("Should not be able to edit ASN field when there is no exception", () => {
        cy.task("insertCourtCasesWithFields", [
            {
                orgForPoliceFilter: "01",
                hearingOutcome: dummyAho.hearingOutcomeXml,
                errorCount: 1
            }
        ])

        cy.login("bichard01@example.com", "password")
        cy.visit("/bichard/court-cases/0")
        
        cy.get(".moj-badge").contains("Editable Field").should("not.exist")
        cy.get("#asn").should("not.exist")
    })

    it("Should not be able to edit ASN field when the case isn't in 'unresolved' state", () => {
        const submittedCaseId = 0
        const resolvedCaseId = 1
        cy.task("insertCourtCasesWithFields", [
            {
                errorStatus: "Submitted",
                errorId: submittedCaseId,
                orgForPoliceFilter: "01",
                hearingOutcome: asnExceptions.hearingOutcomeXml,
                updatedHearingOutcome: asnExceptions.updatedHearingOutcomeXml,
                errorCount: 1
            },
            {
                errorStatus: "Resolved",
                errorId: resolvedCaseId,
                orgForPoliceFilter: "01",
                hearingOutcome: asnExceptions.hearingOutcomeXml,
                updatedHearingOutcome: asnExceptions.updatedHearingOutcomeXml,
                errorCount: 1
            }
        ])

        cy.login("bichard01@example.com", "password")
        cy.visit(`/bichard/court-cases/${submittedCaseId}`)

        cy.get(".moj-badge").contains("Editable Field").should("not.exist")
        cy.get("#asn").should("not.exist")

        cy.visit(`/bichard/court-cases/${resolvedCaseId}`)

        cy.get(".moj-badge").contains("Editable Field").should("not.exist")
        cy.get("#asn").should("not.exist")
    })

    it.only("Should be able to edit ASN field if HO100206 is raised", () => {
        cy.login("bichard01@example.com", "password")
        cy.visit("/bichard/court-cases/0")

        cy.get(".moj-badge").contains("Editable Field").should("exist")
        cy.get("#asn").type("1101ZD0100000448754K")

        cy.get("button").contains("Submit exception(s)").click()

        cy.location().should((loc) => {
            expect(loc.href).to.contain("?resubmitCase=true")
        })

        cy.get("H1").should("have.text", "Case details")
        cy.contains("Notes").click()

        cy.contains("Bichard01: Portal Action: Update Applied. Element: arrestSummonsNumber. New Value: 1101ZD0100000448754K")
        cy.contains("Bichard01: Portal Action: Resubmitted Message.")

        verifyUpdatedMessage({
            expectedCourtCase: { errorId: 0, errorStatus: "Submitted" },
            updatedMessageNotHaveContent: ["<br7:ArrestSummonsNumber>AAAAAAAAAAAAAAAAAAAA</br7:ArrestSummonsNumber>"],
            updatedMessageHaveContent: ["<br7:ArrestSummonsNumber>1101ZD0100000448754K</br7:ArrestSummonsNumber>"]
        })
    })
})

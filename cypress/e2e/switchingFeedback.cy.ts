import SurveyFeedback from "services/entities/SurveyFeedback"
import hashedPassword from "../fixtures/hashedPassword"

const expectToHaveNumberOfFeedbacks = (number: number) => {
  cy.task("getAllFeedbacksFromDatabase").then((result) => {
    const feedbackResults = result as SurveyFeedback[]
    expect(feedbackResults.length).equal(number)
  })
}

const submitAFeedback = () => {
  cy.findByText("Switch to old Bichard").click()
  cy.get("[name=issueOrPreference]").check("no")
  cy.get("[name=caseListOrDetail]").check("0")
  cy.get("[name=componentIssue]").check("0")
  cy.get("[name=otherFeedback]").type("I rather the old Bichard")
  cy.get("[type=submit]").click()
}


describe("Switching Bichard Version Feedback Form", () => {})

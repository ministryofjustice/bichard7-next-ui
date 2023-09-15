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
  cy.get("[name=issueOrPreference]").check("issue")
  cy.get("[name=caseListOrDetail]").check("caselist")
  cy.get("[name=componentIssue]").check("columnHeaders")
  cy.get("[name=otherFeedback]").type("I rather the old Bichard. It's easier to use.")
  cy.get("[type=submit]").click()
}

describe("Switching Bichard Version Feedback Form", () => {
  const expectedUserId = 0

  beforeEach(() => {
    cy.viewport(1280, 720)
    cy.task("clearAllFeedbacksFromDatabase")
    cy.task("clearUsers")

    cy.task("insertUsers", {
      users: [
        {
          id: expectedUserId,
          username: "Bichard01",
          visibleForces: ["01"],
          forenames: "Bichard Test User",
          surname: "01",
          email: "bichard01@example.com",
          password: hashedPassword
        }
      ],
      userGroups: ["B7NewUI_grp"]
    })
    cy.login("bichard01@example.com", "password")
  })

  it("Should be able to submit a switching feedback form when switching to old Bichard", () => {
    cy.visit("/bichard")
    cy.contains("button", "Switch to old Bichard").click()
    submitAFeedback()
  })

  it("Should display error if form is not complete", () => {})

  // it("Should open a feedback form twice a session", () => {})

  it("Should redirect to case list in old Bichard", () => {})

  it("Should redirect to the same case detail page in old Bichard", () => {})
})

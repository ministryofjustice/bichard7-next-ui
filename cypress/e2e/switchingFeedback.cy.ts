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

  it.only("Should access the switching feedback form with first question available", () => {
    cy.visit("/bichard")
    cy.contains("button", "Switch to old Bichard").click()
    cy.get("a").contains("Back")
    cy.get("button").contains("Skip feedback")
    cy.get("h1").contains("Share your feedback")
    cy.get("p")
      .contains(
        "You have selected to revert back to old Bichard. What was the reason for doing so? Can you please select the appropriate option. And outline the problem that occurred below so that we can best understand."
      )
      .should("exist")
    cy.get("h3").contains("Why have you decided to switch version of Bichard?")
    cy.get("h5").contains("Select one of the below option")
    cy.get("label").contains(
      "I have found an issue(s) when using the new version of Bichard which is blocking me from completing my task."
    )
    cy.get("label").contains("I prefer working in the old version, and I dislike working in the new version.")
    cy.get("label").contains("Other (please specify)")
  })

  it.skip("Should show question number 2 and textarea box when first button of first question is selected ", () => {})

  // it("Should show only textarea box when second button of first question is selected ", () => {})

  // it("Should show only textarea box when third button of first question is selected ", () => {})

  // it("Should display error if textarea box is empty when second button is selected", () => {})

  // it("Should display error if textarea box is empty when third button is selected", () => {})

  // it("Should open old version of Bichard when user skips feedback", () => {})

  // it("Should record skipped value when user skips feedback", () => {})

  // it("Should redirect to case list in old Bichard", () => {})

  // it("Should redirect to the same case detail page in old Bichard", () => {})
})

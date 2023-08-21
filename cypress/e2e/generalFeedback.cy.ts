import SurveyFeedback from "services/entities/SurveyFeedback"
import hashedPassword from "../fixtures/hashedPassword"

describe("General Feedback Form", () => {
  beforeEach(() => {
    cy.viewport(1280, 720)
    cy.task("clearCourtCases")
    cy.task("clearUsers")

    cy.task("insertUsers", {
      users: [
        {
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

  // Happy path: submit a feedback with anonymus selected
  it("Should be able to visit feedback page from the caselist", () => {
    cy.visit("/bichard")
    cy.findByText("feedback").click()
    cy.get("h2").contains("Share your feedback").should("exist")
    cy.task("getAllFeedbacksFromDatabase").then((result) => {
      console.log("RESULT FROM TASK:", result)
      const feedbackResults = result as SurveyFeedback[]
      expect(feedbackResults[0].feedbackType).equal(1)
    })
    // Confirm we land on feedback page
    // submit a new feedback
    // - select how satisfied
    // - fill in description box
    // submit
    // expect to return to previous page
  })

  // Happy path: submit a feedback with user data stored
  // Form validation: submit form with no experience selected
  // Form validation: submit form with no experience selected
  // Form validation: submit form with no response
  // Form validation: submit form with more chars than the form allows
  // Redirection: verify to redirect back to previous pages
})

export {}

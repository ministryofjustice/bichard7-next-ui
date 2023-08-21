import SurveyFeedback from "services/entities/SurveyFeedback"
import hashedPassword from "../fixtures/hashedPassword"

describe("General Feedback Form", () => {
  beforeEach(() => {
    cy.viewport(1280, 720)

    cy.task("clearUsers")
    // Database forigen keys
    cy.task("clearAllFeedbacksFromDatabase")

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

  it("Should be able to visit feedback page from the caselist", () => {
    cy.visit("/bichard")
    cy.findByText("feedback").click()
    cy.get("h2").contains("Share your feedback").should("exist")

    // TODO: Links to the Survey?? FAQ page
    // TODO: Links to contact email works
  })

  // Happy path: submit a feedback with anonymous selected
  it("Should be able to submit an anonymous survey", () => {
    cy.visit("/bichard")
    cy.findByText("feedback").click()
    cy.get("h2").contains("Share your feedback").should("exist")

    cy.get("[name=anonymous]").check("yes")
    cy.get("[name=experience]").check("0")
    cy.get("[name=feedback]").type("Something feedback.")
    cy.get("[type=submit]").click()

    cy.task("getAllFeedbacksFromDatabase").then((result) => {
      console.log("RESULT FROM TASK:", result)
      const feedbackResults = result as SurveyFeedback[]
      const feedback = feedbackResults[0]
      expect(feedback.feedbackType).equal(0)
      expect(feedback.userId).equal(null)
    })
  })

  // Happy path: submit a feedback with user data stored
  it("Should be able to submit an user data survey", () => {
    cy.task("getAllFeedbacksFromDatabase").then((result) => {
      console.log("RESULT FROM TASK:", result)
      const feedbackResults = result as SurveyFeedback[]
      const feedback = feedbackResults[0]
      expect(feedback.feedbackType).equal(0)
      // expect(feedback.userId).equal(user.id)
    })
  })

  describe("Should not be able to submit a survey with", () => {
    // Form validation: submit form with no experience selected
    it("no experience selected", () => {})
    it("no response", () => {})
    it("more chars than the form allows", () => {})
  })

  // Form validation: submit form with no experience selected
  // Form validation: submit form with no response
  // Form validation: submit form with more chars than the form allows
  // Redirection: verify to redirect back to previous pages
})

export {}

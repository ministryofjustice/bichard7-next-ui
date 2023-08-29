import SurveyFeedback from "services/entities/SurveyFeedback"
import hashedPassword from "../fixtures/hashedPassword"

const expectToHaveNumberOfFeedbacks = (number: number) => {
  cy.task("getAllFeedbacksFromDatabase").then((result) => {
    const feedbackResults = result as SurveyFeedback[]
    expect(feedbackResults.length).equal(number)
  })
}

describe("General Feedback Form", () => {
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

  it("Should be able to visit feedback page from the caselist", () => {
    cy.visit("/bichard")
    cy.findByText("feedback").click()
    cy.get("h2").contains("Share your feedback").should("exist")

    // TODO: Links to the Survey?? FAQ page
    // TODO: Links to contact email works
  })

  it("Should be able to submit an anonymous survey", () => {
    cy.visit("/bichard")
    cy.findByText("feedback").click()
    cy.get("h2").contains("Share your feedback").should("exist")

    cy.get("[name=isAnonymous]").check("yes")
    cy.get("[name=experience]").check("0")
    cy.get("[name=feedback]").type("Something feedback.")
    cy.get("[type=submit]").click()

    cy.task("getAllFeedbacksFromDatabase").then((result) => {
      const feedbackResults = result as SurveyFeedback[]
      const feedback = feedbackResults[0]
      expect(feedback.feedbackType).equal(0)
      expect(feedback.userId).equal(null)
    })
  })

  it("Should be able to submit a user data survey", () => {
    cy.visit("/bichard")
    cy.findByText("feedback").click()
    cy.get("[name=isAnonymous]").check("no")
    cy.get("[name=experience]").check("0")
    cy.get("[name=feedback]").type("This is feedback is not anonymous")
    cy.get("[type=submit]").click()
    cy.task("getAllFeedbacksFromDatabase").then((result) => {
      const feedbackResults = result as SurveyFeedback[]
      const feedback = feedbackResults[0]
      expect(feedback.feedbackType).equal(0)
      expect(feedback.userId).equal(expectedUserId)
    })
  })

  it.only("Should display error if form is not complete", () => {
    cy.visit("/bichard")
    cy.findByText("feedback").click()
    cy.get("[type=submit]").click()
    expectToHaveNumberOfFeedbacks(0)
    cy.get("#isAnonymous").contains("Select one of the below options")
    cy.get("#experience").contains("Select one of the below options")
    cy.contains("Input message into the text box").should("exist")

    cy.get("[name=isAnonymous]").check("no")
    cy.get("[type=submit]").click()
    expectToHaveNumberOfFeedbacks(0)

    cy.get("#isAnonymous").contains("Select one of the below options").should("not.exist")
    cy.get("#experience").contains("Select one of the below options")
    cy.contains("Input message into the text box").should("exist")

    cy.get("[name=experience]").check("0")
    cy.get("[type=submit]").click()
    expectToHaveNumberOfFeedbacks(0)

    cy.get("#isAnonymous").contains("Select one of the below options").should("not.exist")
    cy.get("#experience").contains("Select one of the below options").should("not.exist")
    cy.contains("Input message into the text box").should("exist")

    cy.get("[name=feedback]").type("This is feedback is not anonymous")
    cy.get("[type=submit]").click()
    expectToHaveNumberOfFeedbacks(1)

    // Redirect back to previous page
  })
})

export {}

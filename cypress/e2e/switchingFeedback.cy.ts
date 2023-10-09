import SurveyFeedback from "services/entities/SurveyFeedback"
import hashedPassword from "../fixtures/hashedPassword"
import TestCases from "../fixtures/switchingFeedbackTestData"

describe("Switching Bichard Version Feedback Form", () => {
  const expectedUserId = 0

  before(() => {
    cy.intercept("GET", "/bichard-ui/*", {
      statusCode: 200,
      body: {
        name: "Dummy response"
      }
    })
  })

  after(() => {
    cy.task("clearAllFeedbacksFromDatabase")
  })

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
      userGroups: ["B7NewUI_grp", "B7Supervisor_grp"]
    })
    cy.login("bichard01@example.com", "password")
  })

  it("Should access the switching feedback form with first question visible when user clicks 'Switch to old Bichard'", () => {
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

  TestCases.forEach(([testName, testInput]) => {
    it(testName, () => {
      cy.task("insertCourtCasesWithFields", [{ orgForPoliceFilter: "01" }])

      testInput.steps.forEach((step) => {
        let element

        if (step.label) {
          element = cy.get(`label:contains("${step.label}")`)
        }

        if (step.button) {
          element = cy.get("button").contains(step.button)
        }

        switch (step.action) {
          case "type":
            element!.find("textarea")[step.action](step.input!)
            break

          case "exists":
            cy.contains(step.text!).should("exist")
            break

          case "check-db":
            cy.task("getAllFeedbacksFromDatabase").then((result) => {
              const feedbackResults = result as SurveyFeedback[]
              expect(feedbackResults).to.have.length(step.shouldExist ? 1 : 0)
              if (step.shouldExist) {
                const feedback = feedbackResults[0]
                expect(feedback.feedbackType).equal(1)
                expect(feedback.userId).equal(expectedUserId)
                expect(feedback.response).deep.equal(step.data)
              }
            })
            break

          case "check":
          case "click":
            element?.click()
            break

          case "match-url":
            cy.url().should("match", step.url)
            break

          case "insert-feedback":
            cy.task("insertFeedback", {
              userId: expectedUserId,
              response: { skipped: true },
              feedbackType: 1,
              createdAt: step.date
            })
          case "switch-to-old-bichard":
            cy.visit(step.navigateTo ?? "/bichard")
            cy.contains("button", "Switch to old Bichard").click()
            break
          case "expectTheFeedbackForm":
            cy.get("#caseListOrDetail").should("not.exist")
            cy.get("#otherFeedback").should("not.exist")
            cy.get("button").contains("Send feedback and continue").should("not.exist")
        }
      })
    })
  })
})

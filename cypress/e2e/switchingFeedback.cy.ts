import SurveyFeedback from "services/entities/SurveyFeedback"
import hashedPassword from "../fixtures/hashedPassword"
import { expectToHaveNumberOfFeedbacks } from "../support/helpers"

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

  it.skip("Should access the switching feedback form with first question visible when user clicks 'Switch to old Bichard'", () => {
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

  type TestCaseStepAction =
    | "check"
    | "exists"
    | "type"
    | "click"
    | "check-db"
    | "match-url"
    | "switch-to-old-bichard"
    | "insert-feedback"

  type TestCaseStep = {
    action: TestCaseStepAction
    input?: string
    button?: string
    label?: string
    text?: string
    idInFor?: boolean
    shouldExist?: boolean
    data?: Record<string, unknown> | null
    url?: RegExp
    date?: Date
  }

  type TestCase = [
    string,
    {
      steps: TestCaseStep[]
    }
  ]
  const TestCases: TestCase[] = [
    [
      "Found an issue > Case list page > Give feedback > Submit",
      {
        steps: [
          {
            action: "check",
            label:
              "I have found an issue(s) when using the new version of Bichard which is blocking me from completing my task.",
            idInFor: true
          },
          {
            action: "check",
            label: "Case list page",
            idInFor: true
          },
          {
            action: "exists",
            text: "Could you explain in detail what problem you have experienced?"
          },
          {
            action: "type",
            input: "Some feedback",
            label: "Tell us why you have made this selection."
          },
          {
            action: "click",
            button: "Send feedback and continue"
          },
          {
            action: "check-db",
            shouldExist: true,
            data: { feedback: "Some feedback", caseListOrDetail: "caselist", issueOrPreference: "issue" }
          }
        ]
      }
    ],
    [
      "Found an issue > Case details page > Give feedback > Submit",
      {
        steps: [
          {
            action: "check",
            label:
              "I have found an issue(s) when using the new version of Bichard which is blocking me from completing my task.",
            idInFor: true
          },
          {
            action: "check",
            label: "Case details page",
            idInFor: true
          },
          {
            action: "exists",
            text: "Could you explain in detail what problem you have experienced?"
          },
          {
            action: "type",
            input: "Some feedback",
            label: "Tell us why you have made this selection."
          },
          {
            action: "click",
            button: "Send feedback and continue"
          },
          {
            action: "check-db",
            shouldExist: true,
            data: { feedback: "Some feedback", caseListOrDetail: "casedetail", issueOrPreference: "issue" }
          }
        ]
      }
    ],
    [
      "Prefer old Bichard > Give feedback > Submit",
      {
        steps: [
          {
            action: "check",
            label: "I prefer working in the old version, and I dislike working in the new version.",
            idInFor: true
          },
          {
            action: "exists",
            text: "Could you please explain why you prefer using the old version of Bichard over the new version Bichard?"
          },
          {
            action: "type",
            input: "Some feedback",
            label: "Tell us why you have made this selection."
          },
          {
            action: "click",
            button: "Send feedback and continue"
          },
          {
            action: "check-db",
            shouldExist: true,
            data: { feedback: "Some feedback", issueOrPreference: "preference" }
          }
        ]
      }
    ],
    [
      "Other > Give feedback > Submit",
      {
        steps: [
          {
            action: "check",
            label: "Other (please specify)",
            idInFor: true
          },
          {
            action: "exists",
            text: "Is there another reason why you are switching version of Bichard?"
          },
          {
            action: "type",
            input: "Some feedback",
            label: "Tell us why you have made this selection."
          },
          {
            action: "click",
            button: "Send feedback and continue"
          },
          {
            action: "check-db",
            shouldExist: true,
            data: { feedback: "Some feedback", issueOrPreference: "other" }
          }
        ]
      }
    ],
    [
      "Found an issue > Don't fill anything > Submit",
      {
        steps: [
          {
            action: "check",
            label:
              "I have found an issue(s) when using the new version of Bichard which is blocking me from completing my task.",
            idInFor: true
          },
          {
            action: "click",
            button: "Send feedback and continue"
          },
          {
            action: "exists",
            text: "Input message into the text box"
          },
          {
            action: "check-db",
            shouldExist: false
          }
        ]
      }
    ],
    [
      "Option > Don't fill anything in > Submit ",
      {
        steps: [
          {
            action: "check",
            label: "Other (please specify)",
            idInFor: true
          },
          {
            action: "click",
            button: "Send feedback and continue"
          },
          {
            action: "exists",
            text: "Input message into the text box"
          },
          {
            action: "check-db",
            shouldExist: false
          }
        ]
      }
    ],
    [
      "Skip Feedback >Database record skip > old Bichard",
      {
        steps: [
          {
            action: "click",
            button: "Skip feedback"
          },
          {
            action: "check-db",
            shouldExist: true,
            data: { skipped: true }
          },
          {
            action: "match-url",
            url: /\/bichard-ui\/.*$/
          }
        ]
      }
    ],
    [
      "Should redirect user to old Bichard within 3 hours of first click on 'Switch to old Bichard' after logging in",
      {
        steps: [
          {
            action: "insert-feedback",
            date: new Date(Date.now() - (179 * 60 * 1000)) // 2 hours and 59 minutes ago
          },

          {
            action: "click",
            button: "Skip feedback"
          },
          {
            action: "check-db",
            shouldExist: true,
            data: { skipped: true }
          },
          {
            action: "match-url",
            url: /\/bichard-ui\/.*$/
          },
          {
            action: "switch-to-old-bichard"
          },
          {
            action: "match-url",
            url: /\/bichard-ui\/.*$/
          }
        ]
      }
    ]
  ]

  TestCases.slice(-1).forEach(([testName, testInput]) => {
    it(testName, () => {
      cy.visit("/bichard")
      cy.contains("button", "Switch to old Bichard").click()

      cy.get("#caseListOrDetail").should("not.exist")
      cy.get("#otherFeedback").should("not.exist")
      cy.get("button").contains("Send feedback and continue").should("not.exist")

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
            cy.task("insertFeedback", {})
          case "switch-to-old-bichard":
            cy.visit("/bichard")
            cy.contains("button", "Switch to old Bichard").click()
        }
      })
    })
  })

  // it("Should redirect user to old Bichard within 3 hours of first click on 'Switch to old Bichard' after logging in", () => {})

  // it("Should redirect user to switching survey after 3 hours of a click on 'Switch to old Bichard'", () => {})

  // it("Should redirect to case list in old Bichard", () => {})

  // it("Should redirect to the same case detail page in old Bichard", () => {})
})

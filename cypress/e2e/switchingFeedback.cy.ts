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

  type SurveyInput = {
    question1Choice: "I have found an issue" | "I prefer working in the old version" | "Other" | undefined
    question2Choice: "Case list page" | "Case details page" | undefined
    moreDetailsText: string | undefined
  }
  type SurveyResult = {
    feedbackSavedToDatabase: boolean
    redirectedToOldBichard: boolean
    question2Error: boolean
    moreDetailsError: boolean
  }
  type TestCase = [string, SurveyInput, SurveyResult]
  const testCases: TestCase[] = [
    [
      "Choosing the first options for both questions and filling in details text",
      {
        question1Choice: "I have found an issue",
        question2Choice: "Case list page",
        moreDetailsText: "There is an issue on the case list page"
      },
      { feedbackSavedToDatabase: true, redirectedToOldBichard: true, question2Error: false, moreDetailsError: false }
    ],
    [
      "Submitting without answering question 2 or giving details",
      {
        question1Choice: "I have found an issue",
        question2Choice: undefined,
        moreDetailsText: undefined
      },
      { feedbackSavedToDatabase: false, redirectedToOldBichard: false, question2Error: true, moreDetailsError: true }
    ],
    [
      "Submitting without answering question 2",
      {
        question1Choice: "I have found an issue",
        question2Choice: undefined,
        moreDetailsText: "Submitted without Question 2"
      },
      { feedbackSavedToDatabase: false, redirectedToOldBichard: false, question2Error: true, moreDetailsError: false }
    ]
  ]
  testCases.forEach(([testName, testInput, testResult]) => {
    it(testName, () => {
      cy.visit("/bichard")
      cy.contains("button", "Switch to old Bichard").click()

      cy.get("#caseListOrDetail").should("not.exist")
      cy.get("#otherFeedback").should("not.exist")
      cy.get("button").contains("Send feedback and continue").should("not.exist")

      const question1AnswerIds = {
        "I have found an issue": "#issueOrPreference-issue",
        "I prefer working in the old version": "#issueOrPreference-preference",
        Other: "issueOrPreference-other"
      }

      if (testInput.question1Choice !== undefined) {
        cy.get(question1AnswerIds[testInput.question1Choice]).check()
        cy.get("#caseListOrDetail").should("exist")

        const question2AnswerIds = {
          "Case list page": "#caseListOrDetail-caselist",
          "Case details page": "#caseListOrDetail-casedetail"
        }
        if (testInput.question2Choice !== undefined) {
          cy.get(question2AnswerIds[testInput.question2Choice]).click()
        }

        if (testInput.question1Choice === "I have found an issue") {
          cy.contains("Could you explain in detail what problem you have experienced?").should("exist")
          cy.get("#otherFeedback").should("exist")

          if (testInput.moreDetailsText !== undefined) {
            cy.get("[name=feedback]").type(testInput.moreDetailsText)
          }
        }

        cy.get("button").contains("Send feedback and continue").should("exist")
        cy.get("button").contains("Send feedback and continue").click()

        if (testResult.redirectedToOldBichard) {
          cy.url().should("match", /\/bichard-ui/)
        } else {
          cy.url().should("not.match", /\/bichard-ui/)
        }

        cy.get("#caseListOrDetail span", {}).should(testResult.question2Error ? "exist" : "not.exist")

        cy.get("#otherFeedback span").should(testResult.moreDetailsError ? "exist" : "not.exist")

        expectToHaveNumberOfFeedbacks(testResult.feedbackSavedToDatabase ? 1 : 0)
      } else {
        cy.get("button").contains("Send feedback and continue").should("not.exist")
      }
    })
  })

  // describe("I have found an issue", () => {
  //   it("Should show text area box when case list page or case details page radio button is selected", () => {
  // cy.visit("/bichard")
  // cy.contains("button", "Switch to old Bichard").click()

  // cy.get("#caseListOrDetail").should("not.exist")
  // cy.get("#otherFeedback").should("not.exist")
  // cy.get("button").contains("Send feedback and continue").should("not.exist")
  // cy.get("#issueOrPreference-issue").check()
  // cy.get("#caseListOrDetail").should("exist")
  // cy.contains("Could you explain in detail what problem you have experienced?").should("exist")
  // cy.get("#otherFeedback").should("exist")
  // cy.get("button").contains("Send feedback and continue").should("exist")
  // cy.get("#caseListOrDetail-caselist").click()
  // cy.get("[name=feedback]").type("This is test feedback")
  // cy.get("button").contains("Send feedback and continue").click()
  // expectToHaveNumberOfFeedbacks(1)
  //   })
  //   it("Should show text area box when case details page radio button is selected", () => {
  //     cy.visit("/bichard")
  //     cy.contains("button", "Switch to old Bichard").click()

  //     cy.get("#caseListOrDetail").should("not.exist")
  //     cy.get("#otherFeedback").should("not.exist")
  //     cy.get("button").contains("Send feedback and continue").should("not.exist")
  //     cy.get("#issueOrPreference-issue").check()
  //     cy.get("#caseListOrDetail").should("exist")
  //     cy.get("#otherFeedback").should("exist")
  //     cy.get("button").contains("Send feedback and continue").should("exist")
  //     cy.get("#caseListOrDetail-casedetail").click()
  //     cy.get("[name=feedback]").type("This is test feedback 2")
  //     cy.get("button").contains("Send feedback and continue").click()
  //     expectToHaveNumberOfFeedbacks(1)
  //   })
  // })

  // describe("I prefer the old verison", () => {
  // it("Should show only textarea box when second button of first question is selected ", () => {})
  // it("Should display error if textarea box is empty when second button is selected", () => {})
  // })

  // describe("Other", () => {
  //   // it("Should show only textarea box when third button of first question is selected ", () => {})
  //   // it("Should display error if textarea box is empty when third button is selected", () => {})
  // })

  // it("Should open old version of Bichard when user skips feedback", () => {})

  // it("Should record skipped value in the database when user skips feedback", () => {})

  // it("Should record User job role, email, and force when feedback form submitted", () => {})

  // it("Should record User job role, email, and force when feedback form skipped", () => {})

  // it("Should open the switching survey the first time user clicks 'Switch to old Bichard' after logging in", () => {})

  // it("Should redirect user to old Bichard within 3 hours of first click on 'Switch to old Bichard' after logging in", () => {})

  // it("Should redirect user to switching survey after 3 hours of a click on 'Switch to old Bichard'", () => {})

  // it("Should redirect to case list in old Bichard", () => {})

  // it("Should redirect to the same case detail page in old Bichard", () => {})
})

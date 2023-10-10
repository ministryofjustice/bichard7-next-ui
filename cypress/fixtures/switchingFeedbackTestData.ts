type TestCaseStepAction =
  | "check"
  | "exists"
  | "type"
  | "click"
  | "check-db"
  | "match-url"
  | "switch-to-old-bichard"
  | "expect-the-feedback-form"
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
  navigateTo?: string
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
          action: "switch-to-old-bichard"
        },
        {
          action: "expect-the-feedback-form"
        },
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
          action: "switch-to-old-bichard"
        },
        {
          action: "expect-the-feedback-form"
        },
        {
          action: "switch-to-old-bichard"
        },
        {
          action: "expect-the-feedback-form"
        },
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
          action: "switch-to-old-bichard"
        },
        {
          action: "expect-the-feedback-form"
        },
        {
          action: "switch-to-old-bichard"
        },
        {
          action: "expect-the-feedback-form"
        },
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
          action: "switch-to-old-bichard"
        },
        {
          action: "expect-the-feedback-form"
        },
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
          action: "switch-to-old-bichard"
        },
        {
          action: "expect-the-feedback-form"
        },
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
          action: "switch-to-old-bichard"
        },
        {
          action: "expect-the-feedback-form"
        },
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
          action: "switch-to-old-bichard"
        },
        {
          action: "expect-the-feedback-form"
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
          date: new Date(Date.now() - 179 * 60 * 1000) // 2 hours and 59 minutes ago
        },
        {
          action: "switch-to-old-bichard"
        },
        {
          action: "match-url",
          url: /\/bichard-ui\/.*$/
        },
        {
          action: "check-db",
          shouldExist: true,
          data: { skipped: true }
        }
      ]
    }
  ],
  [
    "Should redirect user to switching survey after 3 hours of a click on 'Switch to old Bichard'",
    {
      steps: [
        {
          action: "insert-feedback",
          date: new Date(Date.now() - 200 * 60 * 1000) // 3 hours and 20 minutes ago
        },
        {
          action: "switch-to-old-bichard"
        },
        {
          action: "expect-the-feedback-form"
        }
      ]
    }
  ],
  [
    "Should redirect to case list in old Bichard",
    {
      steps: [
        {
          action: "switch-to-old-bichard"
        },
        {
          action: "expect-the-feedback-form"
        },
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
          action: "match-url",
          url: /\/bichard-ui\/RefreshListNoRedirect$/
        }
      ]
    }
  ],
  [
    "Should redirect to the same case detail page in old Bichard",
    {
      steps: [
        {
          action: "switch-to-old-bichard",
          navigateTo: "/bichard/court-cases/0"
        },
        {
          action: "expect-the-feedback-form"
        },
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
          action: "match-url",
          url: /\/bichard-ui\/SelectRecord\?unstick=true&error_id=0$/
        }
      ]
    }
  ]
]

export default TestCases

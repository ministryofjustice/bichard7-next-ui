export type SurveyFeedbackResponse = { experience: string; comment: string }

export type SwitchingFeedbackResponse =
  | {
      issueOrPreference: string
      caseListOrDetail: string
      componentIssue: string
      otherFeedback: string
    }
  | {
      skipped: boolean
    }

export enum SurveyFeedbackType {
  General = 0,
  Switching = 1
}

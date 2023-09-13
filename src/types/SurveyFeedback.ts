export type SurveyFeedbackResponse = { experience: string; comment: string }

export type SwitchingFeedbackResponse = {
  issueOrPreference: string
  caseListOrDetail: string
  componentIssue: string
  otherFeedback: string
}

export enum SurveyFeedbackType {
  General,
  Switching
}

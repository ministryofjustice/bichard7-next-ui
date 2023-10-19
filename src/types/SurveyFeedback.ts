export type FeedbackExperienceValue =
  | "Very satisfied"
  | "Satisfied"
  | "Neither satisfied nor dissatisfied"
  | "Dissatisfied"
  | "Very dissatisfied"

export enum Page {
    caseList = "Case list",
    caseDetails = "Case details",
  }

export type SurveyFeedbackResponse = { experience: FeedbackExperienceValue; comment: string }

export type SwitchingFeedbackResponse =
  | {
      issueOrPreference?: string
      caseListOrDetail?: Page
      otherFeedback?: string
    }
  | {
      skipped: boolean
    }

export enum SurveyFeedbackType {
  General = 0,
  Switching = 1
}

export type FeedbackExperienceValue =
  | "Very satisfied"
  | "Satisfied"
  | "Neither satisfied nor dissatisfied"
  | "Dissatisfied"
  | "Very dissatisfied"

export type SurveyFeedbackResponse = { experience: FeedbackExperienceValue; comment: string }

export type SwitchingFeedbackResponse =
  | {
      issueOrPreference?: string
      caseListOrDetail?: string
      otherFeedback?: string
    }
  | {
      skipped: boolean
    }

export enum SurveyFeedbackType {
  General = 0,
  Switching = 1
}

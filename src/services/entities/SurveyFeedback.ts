import { Column, Entity, PrimaryColumn } from "typeorm"
import type { SurveyFeedbackResponse } from "types/SurveyFeedback"
import { SurveyFeedbackType } from "../../types/SurveyFeedback"
import dateTransformer from "./transformers/dateTransformer"
import jsonTransformer from "./transformers/jsonTransformer"

@Entity({ name: "survey_feedback" })
export default class SurveyFeedback {
  @PrimaryColumn()
  id!: number

  @Column({ transformer: jsonTransformer, type: "jsonb" })
  response!: SurveyFeedbackResponse

  @Column({ type: "enum", enum: SurveyFeedbackType, name: "feedback_type" })
  feedbackType!: SurveyFeedbackType

  @Column({ name: "user_id" })
  userId?: number

  @Column({ name: "created_at", type: "timestamp", transformer: dateTransformer })
  createdAt!: Date
}

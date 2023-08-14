import { Column, Entity, PrimaryColumn } from "typeorm"
import BaseEntity from "./BaseEntity"
import type { SurveyFeedbackResponse } from "types/SurveyFeedback"
import dateTransformer from "./transformers/dateTransformer"
import jsonTransformer from "./transformers/jsonTransformer"

@Entity({ name: "survey_feedback" })
export default class SurveyFeedback extends BaseEntity {
  @PrimaryColumn()
  id!: number

  @Column({ transformer: jsonTransformer, type: "jsonb" })
  response!: SurveyFeedbackResponse

  @Column({ name: "feedback_type" })
  feedbackType!: number

  @Column({ name: "user_id" })
  userId?: number

  @Column({ name: "created_at", type: "timestamp", transformer: dateTransformer })
  createdAt!: Date
}

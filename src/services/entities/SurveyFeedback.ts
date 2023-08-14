import { Column, Entity, PrimaryColumn } from "typeorm"
import BaseEntity from "./BaseEntity"
// eslint-disable-next-line import/no-cycle
import type { SurveyFeedbackResponse } from "types/SurveyFeedback"
import dateTransformer from "./transformers/dateTransformer"
import featureFlagTransformer from "./transformers/featureFlagTransformer"

@Entity({ name: "survey_feedback" })
export default class SurveyFeedback extends BaseEntity {
  @PrimaryColumn()
  id!: number

  @Column({ transformer: featureFlagTransformer, type: "jsonb" })
  response!: SurveyFeedbackResponse

  @Column({ name: "feedback_type" })
  feedbackType!: number

  @Column({ name: "user_id" })
  userId?: number

  @Column({ name: "created_at", type: "timestamp", transformer: dateTransformer })
  createdAt!: Date
}

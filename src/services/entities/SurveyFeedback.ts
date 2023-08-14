import { Column, Entity, PrimaryColumn } from "typeorm"
import BaseEntity from "./BaseEntity"
// eslint-disable-next-line import/no-cycle
import dateTransformer from "./transformers/dateTransformer"

@Entity({ name: "survey_feedback" })
export default class SurveyFeedback extends BaseEntity {
  @PrimaryColumn()
  id!: number

  @Column()
  response!: object

  @Column({ name: "feedback_type" })
  feedbackType!: number

  @Column({ name: "user_id" })
  userId?: string

  @Column({ name: "create_ts", type: "timestamp", transformer: dateTransformer })
  createdAt!: Date
}

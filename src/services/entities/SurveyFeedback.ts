import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import type { Relation } from "typeorm"
import BaseEntity from "./BaseEntity"
// eslint-disable-next-line import/no-cycle
import CourtCase from "./CourtCase"
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
  userId!: string

  userFullName?: string

  @Column({ name: "create_ts", type: "timestamp", transformer: dateTransformer })
  createdAt!: Date

  @ManyToOne(() => CourtCase)
  @JoinColumn({ name: "error_id" })
  courtCase!: Relation<CourtCase>
}

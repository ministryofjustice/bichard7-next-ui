import { Column, Entity, PrimaryColumn } from "typeorm"
import BaseEntity from "./BaseEntity"

@Entity({ name: "error_list" })
export default class CourtCase extends BaseEntity {
  @PrimaryColumn({ name: "message_id" })
  messageId!: string

  @Column({ name: "error_id" })
  errorId!: number

  @Column({ name: "court_name" })
  courtName!: string

  @Column({ name: "court_date" })
  courtDate!: string

  @Column({ name: "ptiurn" })
  ptiurn!: string

  @Column({ name: "defendant_name" })
  defendantName!: string

  @Column({ name: "error_reason" })
  errorReason!: string

  @Column({ name: "trigger_reason" })
  triggerReason!: string

  @Column({ name: "org_for_police_filter" })
  orgForPoliceFilter!: string
}

/* eslint-disable import/no-cycle */
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm"
import type { Relation } from "typeorm"
import BaseEntity from "./BaseEntity"
import dateTransformer from "./transformers/dateTransformer"
import Note from "./Note"
import Trigger from "./Trigger"

@Entity({ name: "error_list" })
export default class CourtCase extends BaseEntity {
  @PrimaryColumn({ name: "error_id" })
  errorId!: number

  @Column({ name: "message_id" })
  messageId!: string

  @Column({ name: "phase" })
  phase!: number

  @Column({ name: "error_status", type: "int4", nullable: true })
  errorStatus!: number | null

  @Column({ name: "trigger_status", type: "int4", nullable: true })
  triggerStatus!: number | null

  @Column({ name: "error_quality_checked", type: "int4", nullable: true })
  errorQualityChecked!: number | null

  @Column({ name: "trigger_quality_checked", type: "int4", nullable: true })
  triggerQualityChecked!: number | null

  @Column({ name: "trigger_count" })
  triggerCount!: number

  @Column({ name: "error_locked_by_id", type: "varchar", nullable: true })
  errorLockedById!: string | null

  @Column({ name: "trigger_locked_by_id", type: "varchar", nullable: true })
  triggerLockedById!: string | null

  @Column({ name: "is_urgent", type: "int2" })
  urgency!: number

  @Column({ name: "asn", type: "varchar", nullable: true })
  asn!: string | null

  @Column({ name: "court_code", type: "varchar", nullable: true })
  courtCode!: string | null

  @Column({ name: "annotated_msg", type: "varchar" })
  hearingOutcome!: string

  @Column({ name: "updated_msg", type: "varchar", nullable: true })
  updatedHearingOutcome!: string | null

  @Column({ name: "error_report" })
  errorReport!: string

  @Column({ name: "create_ts", type: "timestamptz" })
  createdTimestamp!: Date

  @Column({ name: "error_reason", type: "varchar", nullable: true })
  errorReason!: string | null

  @Column({ name: "trigger_reason", type: "varchar", nullable: true })
  triggerReason!: string | null

  @Column({ name: "error_count" })
  errorCount!: number

  @Column({ name: "user_updated_flag", type: "int2", nullable: true })
  userUpdatedFlag!: number | null

  @Column({ name: "court_date", type: "date", nullable: true, transformer: dateTransformer })
  courtDate!: Date | null

  @Column({ name: "ptiurn" })
  ptiurn!: string

  @Column({ name: "court_name" })
  courtName!: string

  @Column({ name: "resolution_ts", type: "timestamptz", nullable: true })
  resolutionTimestamp!: Date | null

  @Column({ name: "msg_received_ts", type: "timestamptz" })
  messageReceivedTimestamp!: Date

  @Column({ name: "error_resolved_by", type: "timestamptz", nullable: true })
  errorResolvedBy!: string | null

  @Column({ name: "trigger_resolved_by", type: "timestamptz", nullable: true })
  triggerResolvedBy!: string | null

  @Column({ name: "error_resolved_ts", type: "timestamptz", nullable: true })
  errorResolvedTimestamp!: Date | null

  @Column({ name: "trigger_resolved_ts", type: "timestamptz", nullable: true })
  triggerResolvedTimestamp!: Date | null

  @Column({ name: "defendant_name", type: "varchar", nullable: true })
  defendantName!: string | null

  @Column({ name: "org_for_police_filter", type: "varchar", nullable: true })
  orgForPoliceFilter!: string | null

  @Column({ name: "court_room", type: "varchar", nullable: true })
  courtRoom!: string | null

  @Column({ name: "court_reference" })
  courtReference!: string

  @Column({ name: "error_insert_ts", type: "timestamptz", nullable: true })
  errorInsertedTimestamp!: Date | null

  @Column({ name: "trigger_insert_ts", type: "timestamptz", nullable: true })
  triggerInsertedTimestamp!: Date | null

  @Column({ name: "pnc_update_enabled", type: "varchar", nullable: true })
  pncUpdateEnabled!: string | null

  @OneToMany(() => Trigger, (trigger) => trigger.courtCase)
  triggers!: Relation<Trigger>[]

  @OneToMany(() => Note, (note) => note.courtCase)
  notes!: Relation<Note>[]

  isLockedByAnotherUser(username: string) {
    return (
      (!!this.errorLockedById && this.errorLockedById !== username) ||
      (!!this.triggerLockedById && this.triggerLockedById !== username)
    )
  }
}

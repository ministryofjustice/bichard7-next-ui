/* eslint-disable import/no-cycle */
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm"
import type { Relation } from "typeorm"
import BaseEntity from "./BaseEntity"
import dateTransformer from "./transformers/dateTransformer"
import Note from "./Note"
import Trigger from "./Trigger"
import ahoTransformer from "./transformers/ahoTransformer"
import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import booleanTransformer from "./transformers/booleanTransformer"

@Entity({ name: "error_list" })
export default class CourtCase extends BaseEntity {
  @PrimaryColumn({ name: "error_id" })
  errorId!: number

  @Column({ name: "message_id" })
  messageId!: string

  @Column({ name: "phase" })
  phase!: number

  @Column({ name: "error_status", nullable: true })
  errorStatus?: number

  @Column({ name: "trigger_status", nullable: true })
  triggerStatus?: number

  @Column({ name: "error_quality_checked", nullable: true })
  errorQualityChecked?: number

  @Column({ name: "trigger_quality_checked", nullable: true })
  triggerQualityChecked?: number

  @Column({ name: "trigger_count" })
  triggerCount!: number

  @Column({ name: "error_locked_by_id" })
  errorLockedById?: string

  @Column({ name: "trigger_locked_by_id" })
  triggerLockedById?: string

  @Column({ name: "is_urgent", transformer: booleanTransformer })
  isUrgent!: boolean

  @Column({ name: "asn", nullable: true })
  asn?: string

  @Column({ name: "court_code", nullable: true })
  courtCode?: string

  @Column({ name: "annotated_msg", type: "varchar", transformer: ahoTransformer })
  hearingOutcome!: AnnotatedHearingOutcome

  @Column({ name: "updated_msg", nullable: true })
  updatedHearingOutcome?: string

  @Column({ name: "error_report" })
  errorReport!: string

  @Column({ name: "create_ts", type: "timestamptz" })
  createdTimestamp!: Date

  @Column({ name: "error_reason", nullable: true })
  errorReason?: string

  @Column({ name: "trigger_reason", nullable: true })
  triggerReason?: string

  @Column({ name: "error_count" })
  errorCount!: number

  @Column({ name: "user_updated_flag", nullable: true, transformer: booleanTransformer })
  userUpdatedFlag?: boolean

  @Column({ name: "court_date", type: "date", nullable: true, transformer: dateTransformer })
  courtDate?: Date

  @Column({ name: "ptiurn" })
  ptiurn!: string

  @Column({ name: "court_name" })
  courtName!: string

  @Column({ name: "resolution_ts", type: "timestamptz", nullable: true })
  resolutionTimestamp?: Date

  @Column({ name: "msg_received_ts", type: "timestamptz" })
  messageReceivedTimestamp!: Date

  @Column({ name: "error_resolved_by", nullable: true })
  errorResolvedBy?: string

  @Column({ name: "trigger_resolved_by", nullable: true })
  triggerResolvedBy?: string

  @Column({ name: "error_resolved_ts", type: "timestamptz", nullable: true })
  errorResolvedTimestamp?: Date

  @Column({ name: "defendant_name", nullable: true })
  defendantName?: string

  @Column({ name: "org_for_police_filter", nullable: true })
  orgForPoliceFilter?: string

  @Column({ name: "court_room", nullable: true })
  courtRoom?: string

  @Column({ name: "court_reference" })
  courtReference!: string

  @Column({ name: "error_insert_ts", type: "timestamptz", nullable: true })
  errorInsertedTimestamp?: Date

  @Column({ name: "trigger_insert_ts", type: "timestamptz", nullable: true })
  triggerInsertedTimestamp?: Date

  @Column({ name: "pnc_update_enabled", nullable: true })
  pncUpdateEnabled?: string

  @Column({ name: "defendant_name_upper", nullable: true })
  defendantNameUpper?: string

  @Column({ name: "court_name_upper", nullable: true })
  courtNameUpper?: string

  @OneToMany(() => Trigger, (trigger) => trigger.courtCase)
  triggers!: Relation<Trigger>[]

  @OneToMany(() => Note, (note) => note.courtCase)
  notes!: Relation<Note>[]
}

import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import type { Relation } from "typeorm"
import BaseEntity from "./BaseEntity"
// eslint-disable-next-line import/no-cycle
import CourtCase from "./CourtCase"
import dateTransformer from "./transformers/dateTransformer"

@Entity({ name: "error_list_triggers" })
export default class Trigger extends BaseEntity {
  @PrimaryColumn({ name: "trigger_id" })
  triggerId!: number

  @Column({ name: "trigger_code" })
  triggerCode!: string

  @Column({ name: "error_id" })
  errorId!: number

  @Column({ name: "resolved_by" })
  resolvedBy?: string

  @Column({ name: "resolved_ts", type: "timestamp", transformer: dateTransformer })
  resolvedAt?: Date

  @ManyToOne(() => CourtCase)
  @JoinColumn({ name: "error_id" })
  courtCase!: Relation<CourtCase>
}

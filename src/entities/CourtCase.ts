/* eslint-disable import/no-cycle */
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm"
import type { Relation } from "typeorm"
import BaseEntity from "./BaseEntity"
import dateTransformer from "./transformers/dateTransformer"
import Note from "./Note"
import Trigger from "./Trigger"
import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/src/types/AnnotatedHearingOutcome"
import parseAhoXml from "@moj-bichard7-developers/bichard7-next-core/src/parse/parseAhoXml/parseAhoXml"
import convertAhoToXml from "@moj-bichard7-developers/bichard7-next-core/src/serialise/ahoXml/generate"

@Entity({ name: "error_list" })
export default class CourtCase extends BaseEntity {
  @PrimaryColumn({ name: "error_id" })
  errorId!: number

  @Column({ name: "message_id" })
  messageId!: string

  @Column({ name: "court_name" })
  courtName!: string

  @Column({ name: "court_date", type: "date", nullable: true, transformer: dateTransformer })
  courtDate?: Date

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

  @OneToMany(() => Trigger, (trigger) => trigger.courtCase)
  triggers!: Relation<Trigger>[]

  @Column({ name: "trigger_count" })
  triggerCount!: number

  @Column({ name: "error_count" })
  errorCount!: number

  @Column({
    name: "annotated_msg",
    transformer: {
      to: (value) => convertAhoToXml(value),
      from: (value) => parseAhoXml(value)
    }
  })
  ahoXml!: AnnotatedHearingOutcome

  @OneToMany(() => Note, (note) => note.courtCase)
  notes!: Relation<Note>[]
}

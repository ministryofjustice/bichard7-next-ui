import { Column, Entity, PrimaryColumn } from "typeorm"
import BaseEntity from "./BaseEntity"
import delimeterStringTransfomer from "./transformers/delimeterStringTransfomer"

@Entity({ name: "users" })
export default class User extends BaseEntity {
  @PrimaryColumn()
  username!: string

  @Column()
  forenames?: string

  @Column()
  surname?: string

  @Column({ name: "visible_forces", transformer: delimeterStringTransfomer(","), type: "varchar" })
  visibleForces!: string[]
}

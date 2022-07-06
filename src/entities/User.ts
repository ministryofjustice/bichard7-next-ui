import { Column, Entity, PrimaryColumn, Unique } from "typeorm"
import BaseEntity from "./BaseEntity"

@Entity({ name: "users" })
export default class User extends BaseEntity {
  @PrimaryColumn()
  username!: string

  @Column()
  forenames?: string

  @Column()
  surname?: string

  @Column({ name: "visible_forces" })
  visibleForces!: string
}

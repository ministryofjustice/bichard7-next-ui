import { Column, Entity, PrimaryColumn } from "typeorm"
import BaseEntity from "./BaseEntity"
import delimitedPrefixedString from "./transformers/delimitedPrefixedString"

@Entity({ name: "users" })
export default class User extends BaseEntity {
  @PrimaryColumn()
  username!: string

  @Column()
  email!: string

  @Column()
  forenames?: string

  @Column()
  surname?: string

  @Column({ name: "visible_forces", transformer: delimitedPrefixedString(",", "0"), type: "varchar" })
  visibleForces!: string[]
}

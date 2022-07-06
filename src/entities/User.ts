import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity({ name: "users" })
export default class User {
  @PrimaryColumn()
  username!: string

  @Column({ name: "visible_forces" })
  visibleForces!: string
}

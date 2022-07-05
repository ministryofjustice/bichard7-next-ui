import { Entity, PrimaryColumn } from "typeorm"

@Entity({ name: "users" })
export default class User {
  @PrimaryColumn({ name: "username" })
  username!: string
}

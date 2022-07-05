import { Column, Entity } from "typeorm"

@Entity({ name: "users" })
export default class User {
  @Column()
  username!: string
}

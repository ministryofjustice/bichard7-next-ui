import type { default as KeyValuePair } from "@moj-bichard7-developers/bichard7-next-core/dist/types/KeyValuePair"
import { Column, Entity, PrimaryColumn } from "typeorm"
import BaseEntity from "./BaseEntity"
import featureFlagTransformer from "./transformers/featureFlagTransformer"
import delimitedString from "./transformers/delimitedString"
import { UserGroup } from "../../types/UserGroup"
import { isSupervisor, userAccess } from "../../utils/userPermissions"
import Feature from "types/Feature"

@Entity({ name: "users" })
export default class User extends BaseEntity {
  @PrimaryColumn()
  username!: string

  @Column()
  password!: string

  @Column()
  email!: string

  @Column()
  forenames?: string

  @Column()
  surname?: string

  @Column({ name: "visible_forces", transformer: delimitedString(","), type: "varchar" })
  visibleForces!: string[]

  @Column({ name: "visible_courts", transformer: delimitedString(","), type: "varchar" })
  visibleCourts!: string[]

  @Column({ name: "excluded_triggers", transformer: delimitedString(","), type: "varchar" })
  excludedTriggers!: string[]

  @Column({ name: "feature_flags", transformer: featureFlagTransformer, type: "jsonb" })
  featureFlags!: KeyValuePair<string, boolean>

  groups: UserGroup[] = []

  get hasAccessTo(): { [key in Feature]: boolean } {
    return userAccess(this)
  }

  get isSupervisor() {
    return isSupervisor(this)
  }
}

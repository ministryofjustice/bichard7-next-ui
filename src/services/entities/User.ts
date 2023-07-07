import { Column, Entity, PrimaryColumn } from "typeorm"
import type { KeyValuePair } from "types/KeyValuePair"
import BaseEntity from "./BaseEntity"
import featureFlagTransformer from "./transformers/featureFlagTransformer"
import delimitedString from "./transformers/delimitedString"
import { UserGroup } from "../../types/UserGroup"
import { hasAccessToExceptions, hasAccessToTriggers, isSupervisor } from "../../utils/userPermissions"

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

  get hasAccessToTriggers() {
    return hasAccessToTriggers(this)
  }

  get hasAccessToExceptions() {
    return hasAccessToExceptions(this)
  }

  get isSupervisor() {
    return isSupervisor(this)
  }
}

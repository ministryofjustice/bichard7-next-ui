import { Column, Entity, PrimaryColumn } from "typeorm"
import type KeyValuePair from "types/KeyValuePair"
import BaseEntity from "./BaseEntity"
import delimitedPrefixedString from "./transformers/delimitedPrefixedString"
import featureFlagTransformer from "./transformers/featureFlagTransformer"

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

  @Column({ name: "feature_flags", transformer: featureFlagTransformer, type: "json" })
  featureFlags?: KeyValuePair<string, boolean>

  hasAccessToFeature(name: string): boolean {
    return this.featureFlags !== undefined && this.featureFlags[name] === true
  }
}

import { Column, Entity, PrimaryColumn } from "typeorm"
import GroupName from "types/GroupName"
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

  @Column({ name: "feature_flags", transformer: featureFlagTransformer, type: "jsonb" })
  featureFlags!: KeyValuePair<string, boolean>

  private _groups: GroupName[] = []

  get groups() {
    return this._groups
  }

  set groups(value: GroupName[]) {
    this._groups = value
  }

  get canLockTriggers() {
    return this._groups.some(
      (group) =>
        group === "TriggerHandler" || group === "GeneralHandler" || group === "Allocator" || group === "Supervisor"
    )
  }

  get canLockExceptions() {
    return this._groups.some(
      (group) =>
        group === "ExceptionHandler" || group === "GeneralHandler" || group === "Allocator" || group === "Supervisor"
    )
  }

  get canUnlockOtherUsersTriggers() {
    return this._groups.some((group) => group === "Allocator" || group === "Supervisor")
  }

  get canUnlockOtherUsersExceptions() {
    return this._groups.some((group) => group === "Allocator" || group === "Supervisor")
  }
}

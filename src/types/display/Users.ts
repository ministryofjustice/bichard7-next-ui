import User from "services/entities/User"

type displayPartialUserPickedFields = "username" | "forenames" | "surname"

export type DisplayPartialUser = Pick<User, displayPartialUserPickedFields>

type displayFullUserPickedFields =
  | displayPartialUserPickedFields
  | "email"
  | "visibleForces"
  | "visibleCourts"
  | "excludedTriggers"
  | "featureFlags"
  | "groups"
  | "hasAccessTo"

export type DisplayFullUser = Pick<User, displayFullUserPickedFields>

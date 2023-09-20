import User from "services/entities/User"

type currentUserOmittedFields = "id" | "password" | "queryStringCookieName" | "notes" | "serialize" | "toJSON"
export type CurrentUser = Omit<User, currentUserOmittedFields>

type otherUserOmittedFields =
  | currentUserOmittedFields
  | "email"
  | "visibleForces"
  | "visibleCourts"
  | "excludedTriggers"
  | "featureFlags"
  | "notes"
  | "groups"
  | "hasAccessTo"
export type OtherUser = Omit<User, otherUserOmittedFields>

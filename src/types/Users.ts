import User from "services/entities/User"

type currentUserOmittedFields = "id" | "password" | "queryStringCookieName" | "notes" | "serialize" | "toJSON"
export type CurrentUser = Omit<User, currentUserOmittedFields>


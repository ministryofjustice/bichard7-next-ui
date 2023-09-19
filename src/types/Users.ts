import User from "services/entities/User"

type currentUserDtoFields = "id" | "password" | "queryStringCookieName" | "notes" | "serialize" | "toJSON"
export type CurrentUserDto = Omit<User, currentUserDtoFields>

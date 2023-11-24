import { createContext, useContext } from "react"
import { DisplayFullUser } from "types/display/Users"

interface CurrentUserContextType {
  currentUser: DisplayFullUser
}

const CurrentUserContext = createContext<CurrentUserContextType | null>(null)

const useCurrentUserContext = () => {
  const currentUserContext = useContext(CurrentUserContext)

  if (!currentUserContext) {
    throw new Error("currentUser has to be used within <CurrentUserContextType>")
  }

  return currentUserContext
}

export { CurrentUserContext, useCurrentUserContext }
export type { CurrentUserContextType }

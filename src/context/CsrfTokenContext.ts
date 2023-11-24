import { createContext } from "react"

interface CsrfTokenContextType {
  csrfToken: string
}

const CsrfTokenContext = createContext<CsrfTokenContextType | null>(null)

export { CsrfTokenContext }
export type { CsrfTokenContextType }

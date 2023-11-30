import { createContext, useContext } from "react"

interface CsrfTokenContextType {
  csrfToken: string
}

const CsrfTokenContext = createContext<CsrfTokenContextType | null>(null)

const useCsrfToken = () => {
  const csrfTokenContext = useContext(CsrfTokenContext)

  if (!csrfTokenContext) {
    throw new Error("csrfToken has to be used within <CsrfTokenContext.Provider>")
  }

  return csrfTokenContext
}

export { CsrfTokenContext, useCsrfToken }
export type { CsrfTokenContextType }

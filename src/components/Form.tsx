import { ReactNode } from "react"
import { CSRF } from "../config"

interface Props {
  children: ReactNode
  csrfToken: string
  method: string
  action?: string
}

const Form = ({ children, csrfToken, method, action }: Props) => {
  const { tokenName } = CSRF

  return (
    <form method={method} action={action}>
      <input type="hidden" name={tokenName} value={csrfToken} />
      {children}
    </form>
  )
}

export default Form

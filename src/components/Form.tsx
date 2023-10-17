import { FormEventHandler, ReactNode } from "react"
import { CSRF } from "../config"

interface Props {
  children: ReactNode
  csrfToken: string
  method: string
  action?: string
  onSubmit?: FormEventHandler<HTMLFormElement>
}

const Form = ({ children, csrfToken, method, action, onSubmit }: Props) => {
  const { tokenName } = CSRF

  return (
    <form method={method} action={action} onSubmit={onSubmit}>
      <input type="hidden" name={tokenName} value={csrfToken} />
      {children}
    </form>
  )
}

export default Form

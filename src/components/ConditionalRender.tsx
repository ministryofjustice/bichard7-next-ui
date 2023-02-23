import type { ReactNode } from "react"

interface Props {
  isRendered: boolean
  children: ReactNode
}
const ConditionalRender = ({ isRendered, children }: Props) => {
  if (!isRendered) {
    return null
  }

  return <>{children}</>
}

export default ConditionalRender

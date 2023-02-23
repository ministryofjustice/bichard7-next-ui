import type { ReactNode } from "react"

interface Props {
  isRendered: boolean
  children: ReactNode
}
const If = ({ isRendered, children }: Props) => {
  if (!isRendered) {
    return null
  }

  return <>{children}</>
}

export default If

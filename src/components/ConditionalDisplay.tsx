import type { ReactNode } from "react"

interface Props {
  isDisplayed: boolean
  children: ReactNode
}

const ConditionalDisplay = ({ isDisplayed, children }: Props) => {
  if (isDisplayed) {
    return <div>{children}</div>
  }

  return <></>
}

export default ConditionalDisplay

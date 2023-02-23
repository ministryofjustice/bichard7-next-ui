import type { ReactNode } from "react"
import { useCustomStyles } from "../../styles/customStyles"

interface Props {
  isDisplayed: boolean
  children: ReactNode
}

const ConditionalDisplay = ({ isDisplayed, children }: Props) => {
  const classes = useCustomStyles()
  return <div className={isDisplayed ? "" : classes.hidden}>{children}</div>
}

export default ConditionalDisplay

import type { ReactNode } from "react"
import { useCustomStyles } from "../../styles/customStyles"

interface Props {
  isVisible: boolean
  children: ReactNode
}

const Hide = ({ isVisible, children }: Props) => {
  const classes = useCustomStyles()
  return <div className={isVisible ? "" : classes.hidden}>{children}</div>
}

export default Hide

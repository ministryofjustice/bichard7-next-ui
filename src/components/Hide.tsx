import type { ReactNode } from "react"
import { useCustomStyles } from "../../styles/customStyles"

interface Props {
  isHidden: boolean
  children: ReactNode
}

const Hide = ({ isHidden, children }: Props) => {
  const classes = useCustomStyles()
  return <div className={isHidden ? "" : classes.hidden}>{children}</div>
}

export default Hide

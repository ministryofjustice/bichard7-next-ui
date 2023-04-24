import type { ReactEventHandler } from "react"
import { createUseStyles } from "react-jss"

interface Props {
  children: React.ReactNode
  className?: string
  onClick?: ReactEventHandler
}

const useStyles = createUseStyles({
  button: {
    background: "none",
    border: "none",
    padding: "0",
    color: "#1d70b8",
    textDecoration: "underline",
    cursor: "pointer"
  }
})

const ActionLink: React.FC<Props> = ({ children, className, onClick }) => {
  const classes = useStyles()

  return (
    <button onClick={onClick} className={[classes.button, className, "moj-action-link"].join(" ")}>
      {children}
    </button>
  )
}

export default ActionLink

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
    color: "#1d70b8",
    cursor: "pointer",
    padding: "0",
    textAlign: "left",
    textDecoration: "underline",
    fontSize: "inherit"
  }
})

const ActionLink = ({ children, className, onClick }: Props) => {
  const classes = useStyles()

  return (
    <button onClick={onClick} className={`${classes.button} ${className} moj-action-link`}>
      {children}
    </button>
  )
}

export default ActionLink

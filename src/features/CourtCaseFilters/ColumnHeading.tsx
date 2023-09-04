import { ReactNode } from "react"
import { createUseStyles } from "react-jss"

const useStyles = createUseStyles({
  container: {
    width: "fit-content",
    display: "flex",
    alignItems: "flex-end"
  },
  content: {
    display: "inline-block",
    verticalAlign: "bottom",
    marginBottom: "7px"
  }
})

interface Props {
  children?: ReactNode
}

const ColumnHeading: React.FC<Props> = ({ children }) => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <div className={classes.content}>{children}</div>
    </div>
  )
}

export default ColumnHeading

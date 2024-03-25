import { ReactNode } from "react"
import { createUseStyles } from "react-jss"
import { gdsMidGrey } from "utils/colours"

const useStyles = createUseStyles({
  previewContainer: {
    borderColor: gdsMidGrey,
    backgroundColor: "white",
    border: "1px solid",
    borderLeft: "5px solid",
    padding: "15px 20px"
  }
})

interface PreviewProps {
  children: ReactNode
  className?: string
}

export const Preview = ({ children, className }: PreviewProps) => {
  const classes = useStyles()
  return (
    <>
      <div className={classes.previewContainer + (className ? ` ${className}` : "")}>{children}</div>
    </>
  )
}

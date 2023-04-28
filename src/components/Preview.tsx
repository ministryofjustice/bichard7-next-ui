import { ReactNode } from "react"
import { createUseStyles } from "react-jss"
import { gdsLightGrey } from "utils/colours"

const useStyles = createUseStyles({
  previewContainer: {
    backgroundColor: gdsLightGrey,
    borderLeft: "5px solid #b1b4b6",
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

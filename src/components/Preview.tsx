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
}

export const Preview = ({ children }: PreviewProps) => {
  const classes = useStyles()
  return (
    <>
      <div className={classes.previewContainer}>{children}</div>
    </>
  )
}

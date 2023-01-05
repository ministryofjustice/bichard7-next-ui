import { ReactNode } from "react"
import { createUseStyles } from "react-jss"

interface Props {
  children: ReactNode
}

const useStyles = createUseStyles({
  "govuk-width-container": {
    maxWidth: "100%",
    padding: "30px 40px"
  }
})

const PageTemplate = ({ children }: Props) => {
  const classes = useStyles()
  return (
    <div className={classes["govuk-width-container"]}>
      <main id="main-content" role="main">
        {children}
      </main>
    </div>
  )
}

export default PageTemplate

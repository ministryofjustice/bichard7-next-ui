import { createUseStyles } from "react-jss"
import { textGrey } from "utils/colours"

export const useCustomStyles = createUseStyles({
  "max-width": {
    maxWidth: "100%",
    padding: "0 40px"
  },
  "govuk-width-container": {
    maxWidth: "100%",
    padding: "30px 40px"
  },
  "top-padding": {
    paddingTop: "30px"
  },
  "border-grey": {
    border: `3px solid ${textGrey}`
  }
})

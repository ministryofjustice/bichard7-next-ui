import { createUseStyles } from "react-jss"
import { darkGray } from "utils/colours"

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
  "margin-top-bottom": {
    margin: "12px 0"
  },
  "dark-gray-filter-tag": {
    background: darkGray,
    color: "white",
    "&:visited": {
      color: "white"
    },
    "&:after": {
      backgroundImage: "url(/bichard/moj_assets/images/icon-tag-remove-cross-white.svg)"
    }
  }
})

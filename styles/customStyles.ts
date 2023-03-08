import { createUseStyles } from "react-jss"
import { darkGrey, navy, tagBlue, textBlue, yellow } from "utils/colours"

export const useCustomStyles = createUseStyles({
  "button--tag": {
    display: "inline-flex",
    flexWrap: "nowrap",
    alignItems: "center",
    flexDirection: "row",
    padding: "8px 18px 8px 8px",
    border: "none",
    gap: "11px",
    backgroundColor: tagBlue,
    color: textBlue,
    fontSize: "16px",
    textDecoration: "underline",
    cursor: "pointer",
    "&:hover": {
      color: "white",
      background: navy
    },
    "&:hover img": {
      filter: "invert(1)"
    },
    "&:focus": {
      color: "black",
      background: yellow
    },
    "&:focus img": {
      filter: "contrast(1)"
    }
  },
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
  "dark-grey-filter-tag": {
    background: darkGrey,
    color: "white",
    "&:visited": {
      color: "white"
    },
    "&:after": {
      backgroundImage: "url(/bichard/moj_assets/images/icon-tag-remove-cross-white.svg)"
    },
    "&:link": {
      color: "white"
    }
  },
  hidden: {
    display: "none"
  }
})

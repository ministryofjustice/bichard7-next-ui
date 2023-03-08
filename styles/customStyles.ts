import { createUseStyles } from "react-jss"
import { darkGrey } from "utils/colours"

export const useCustomStyles = createUseStyles({
  "button--tag": {
    border: "none",
    gap: "11px",
    display: "inline-flex",
    flexWrap: "nowrap",
    alignItems: "center",
    flexDirection: "row",
    paddingTop: "8px",
    paddingRight: "18px",
    paddingBottom: "8px",
    paddingLeft: "8px",
    backgroundColor: "#e9f1f8",
    color: "#114e81",
    fontSize: "16px",
    cursor: "pointer",
    textDecoration: "underline",
    "&:hover": {
      color: "white",
      background: "#1D70B8"
    },
    "&:hover img": {
      filter: "invert(1)"
    },
    "&:focus": {
      color: "black",
      background: "#FFDD00"
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

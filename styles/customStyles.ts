import { createUseStyles } from "react-jss"
import { blue, darkGrey, gdsBlack, gdsLightGrey, tagBlue, textBlue, yellow } from "../src/utils/colours"

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
    fontSize: "1em",
    textDecoration: "underline",
    cursor: "pointer",
    "&:hover": {
      color: "white",
      background: blue
    },
    "&:hover img": {
      filter: "invert(1)"
    },
    "&:focus": {
      color: gdsBlack,
      background: yellow
    },
    "&:focus img": {
      filter: "contrast(1)"
    }
  },
  "small-button--tag": {
    display: "inline-flex",
    flexWrap: "nowrap",
    alignItems: "center",
    flexDirection: "row",
    padding: "0px",
    border: "none",
    backgroundColor: "white",
    gap: "11px",
    color: blue,
    fontSize: "1em",
    textDecoration: "underline",
    cursor: "pointer",
    "&:hover": {
      color: "white",
      background: blue
    },
    "&:hover img": {
      filter: "invert(1)"
    },
    "&:focus": {
      color: gdsBlack,
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
  "top-padding-none": {
    paddingTop: "0px"
  },
  "row-top-padding-none": {
    td: {
      paddingTop: "0px"
    }
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
  },
  "light-grey-background": {
    backgroundColor: gdsLightGrey
  },
  "border-bottom-none": {
    borderBottom: "none"
  },
  "no-margin-bottom": {
    marginBottom: 0
  },
  "editable-field__label": {
    verticalAlign: "top",
    "& .error-icon": {
      paddingTop: ".62rem"
    }
  },
  "editable-field__content": {
    "& .badge-wrapper": {
      padding: ".94rem 0 .62rem 0",
      display: "flex",
      gap: ".62rem",
      alignItems: "center"
    }
  }
})

import { GridCol, GridRow, Link } from "govuk-react"
import ActionLink from "../ActionLink"
import getExceptionPathDetails from "../../utils/getExceptionPathDetails"
import getExceptionDefinition from "../../utils/getExceptionDefinition"
import { createUseStyles } from "react-jss"
import NavigationHandler from "../../types/NavigationHandler"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"

type Props = {
  onNavigate: NavigationHandler
  path: (string | number)[]
  code: ExceptionCode
}

const useStyles = createUseStyles({
  exceptionRow: {
    "&:not(:last-child)": {
      marginBottom: "25px"
    }
  },

  exceptionHelp: {
    marginTop: "10px"
  }
})

const DefaultException = ({ path, code, onNavigate }: Props) => {
  const classes = useStyles()
  const { tab, offenceOrderIndex, formattedFieldName, location } = getExceptionPathDetails(path)
  const exceptionDefinition = getExceptionDefinition(code)

  const handleClick = () => {
    switch (tab) {
      case "Offences":
        onNavigate({ location: "Case Details > Offences", args: { offenceOrderIndex } })
        break
      case "Case":
        onNavigate({ location: "Case Details > Case" })
        break
    }
  }

  return (
    <div className={`${classes.exceptionRow} moj-exception-row`}>
      <GridRow className="exception-header">
        <GridCol>
          <b>
            {formattedFieldName}
            {" / "}
          </b>
          <ActionLink onClick={handleClick} className="exception-location">
            {location}
          </ActionLink>
        </GridCol>
      </GridRow>

      <GridRow className="exception-details">
        <GridCol>
          {code}
          {exceptionDefinition?.shortDescription && ` - ${exceptionDefinition.shortDescription}`}
        </GridCol>
      </GridRow>

      <GridRow className={`${classes.exceptionHelp} exception-help`}>
        <GridCol>
          <Link href={`/help/bichard-functionality/exceptions/resolution.html#${code}`} target="_blank">
            {"More information"}
          </Link>
        </GridCol>
      </GridRow>
    </div>
  )
}

export default DefaultException

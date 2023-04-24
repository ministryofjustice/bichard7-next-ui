import { GridCol, GridRow } from "govuk-react"
import CourtCase from "../../../services/entities/CourtCase"
import { createUseStyles } from "react-jss"
import groupErrorsFromReport from "utils/formatReasons/groupErrorsFromReport"
import getExceptionInfo from "utils/getExceptionInfo"
import ActionLink from "components/ActionLink"

interface Props {
  courtCase: CourtCase
}

const useStyles = createUseStyles({
  exceptionRow: {
    "& .exception-details-column": {
      "& .exception-field": {
        display: "block",
        fontSize: "19px",
        fontWeight: "bold"
      },
      "& .exception-details": {
        fontSize: "16px"
      }
    }
  }
})

const Exceptions: React.FC<Props> = ({ courtCase }) => {
  const exceptions = groupErrorsFromReport(courtCase.errorReport)
  const classes = useStyles()

  return (
    <>
      {Object.keys(exceptions).map((code, codeIndex) => {
        const exceptionInfo = getExceptionInfo(code)

        return exceptions[code].fields.map((field) => {
          return (
            <GridRow key={`exception_${codeIndex}_${field}`} className={classes.exceptionRow}>
              <GridCol className="exception-details-column">
                <ActionLink className="exception-field">{field.displayName}</ActionLink>
                <p className="exception-details">
                  {code}
                  {exceptionInfo?.title && ` - ${exceptionInfo.title}`}
                </p>
              </GridCol>
            </GridRow>
          )
        })
      })}
    </>
  )
}

export default Exceptions

import { GridCol, GridRow, Link } from "govuk-react"
import { createUseStyles } from "react-jss"
import getExceptionDefinition from "utils/getExceptionDefinition"
import ActionLink from "components/ActionLink"
import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import getExceptionPathDetails from "utils/getExceptionPathDetails"
import CaseDetailsTab from "types/CaseDetailsTab"
import type NavigationHandler from "types/NavigationHandler"

interface Props {
  aho: AnnotatedHearingOutcome
  onNavigate: NavigationHandler
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

const Exceptions = ({ aho, onNavigate }: Props) => {
  const classes = useStyles()

  const handleClick = (tab?: CaseDetailsTab, offenceOrderIndex?: number) => {
    switch (tab) {
      case "Offences":
        onNavigate({ location: "Case Details > Offences", args: { offenceOrderIndex } })
        break
      case "Case information":
        onNavigate({ location: "Case Details > Case information" })
        break
    }
  }

  return (
    <>
      {aho.Exceptions.length === 0 && "There are no exceptions for this case."}
      {aho.Exceptions.map(({ code, path }, index) => {
        const exceptionDefinition = getExceptionDefinition(code)
        const { tab, offenceOrderIndex, formattedFieldName, location } = getExceptionPathDetails(path)

        return (
          <div key={`exception_${index}`} className={`${classes.exceptionRow} moj-exception-row`}>
            <GridRow className="exception-header">
              <GridCol>
                <b>
                  {formattedFieldName}
                  {" / "}
                </b>
                <ActionLink onClick={() => handleClick(tab, offenceOrderIndex)} className="exception-field">
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
      })}
    </>
  )
}

export default Exceptions

import { GridCol, GridRow } from "govuk-react"
import { createUseStyles } from "react-jss"
import getExceptionInfo from "utils/getExceptionInfo"
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
        const exceptionInfo = getExceptionInfo(code)
        const { tab, offenceOrderIndex, displayText } = getExceptionPathDetails(path)

        return (
          <GridRow key={`exception_${index}`} className={`${classes.exceptionRow} moj-exception-row`}>
            <GridCol className="exception-details-column">
              <ActionLink onClick={() => handleClick(tab, offenceOrderIndex)} className="exception-field">
                {displayText}
              </ActionLink>
              <p className="exception-details">
                {code}
                {exceptionInfo?.title && ` - ${exceptionInfo.title}`}
              </p>
            </GridCol>
          </GridRow>
        )
      })}
    </>
  )
}

export default Exceptions

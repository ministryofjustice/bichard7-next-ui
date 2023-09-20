import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/dist/types/AnnotatedHearingOutcome"
import ActionLink from "components/ActionLink"
import ConditionalRender from "components/ConditionalRender"
import LinkButton from "components/LinkButton"
import { GridCol, GridRow, Link } from "govuk-react"
import { createUseStyles } from "react-jss"
import CourtCase from "services/entities/CourtCase"
import CaseDetailsTab from "types/CaseDetailsTab"
import type NavigationHandler from "types/NavigationHandler"
import { CurrentUser } from "types/Users"
import { exceptionsAreLockedByCurrentUser } from "utils/caseLocks"
import getExceptionDefinition from "utils/getExceptionDefinition"
import getExceptionPathDetails from "utils/getExceptionPathDetails"

interface Props {
  courtCase: CourtCase
  aho: AnnotatedHearingOutcome
  user: CurrentUser
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

const Exceptions = ({ courtCase, aho, user, onNavigate }: Props) => {
  const classes = useStyles()

  const handleClick = (tab?: CaseDetailsTab, offenceOrderIndex?: number) => {
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
                <ActionLink onClick={() => handleClick(tab, offenceOrderIndex)} className="exception-location">
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

            <GridRow>
              <ConditionalRender isRendered={exceptionsAreLockedByCurrentUser(courtCase, user.username)}>
                <LinkButton href="resolve">{"Mark As Manually Resolved"}</LinkButton>
              </ConditionalRender>
            </GridRow>
          </div>
        )
      })}
    </>
  )
}

export default Exceptions

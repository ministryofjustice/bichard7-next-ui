import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import { GridCol, GridRow, Link } from "govuk-react"
import NavigationHandler from "../../types/NavigationHandler"
import getExceptionDefinition from "../../utils/getExceptionDefinition"
import getExceptionPathDetails from "../../utils/getExceptionPathDetails"
import ActionLink from "../ActionLink"
import { ExceptionRow, ExceptionRowHelp } from "./Exception.styles"

type Props = {
  onNavigate: NavigationHandler
  path: (string | number)[]
  code: ExceptionCode
}

const DefaultException = ({ path, code, onNavigate }: Props) => {
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
    <ExceptionRow className={`moj-exception-row`}>
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

      <ExceptionRowHelp className={`exception-help`}>
        <GridCol>
          <Link href={`/help/bichard-functionality/exceptions/resolution.html#${code}`} target="_blank">
            {"More information"}
          </Link>
        </GridCol>
      </ExceptionRowHelp>
    </ExceptionRow>
  )
}

export default DefaultException

import { GridCol, GridRow, Link } from "govuk-react"
import getExceptionDefinition from "../../utils/getExceptionDefinition"
import { createUseStyles } from "react-jss"
import Badge from "../Badge"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import Accordion from "../Accordion"

type Props = {
  code: ExceptionCode
  message?: string
}

const useStyles = createUseStyles({
  exceptionRow: {
    "& .exception-row": {
      marginBottom: ".5rem"
    },
    "&:not(:last-child)": {
      marginBottom: "25px"
    }
  }
})

const pncExceptionDescriptions = {
  [ExceptionCode.HO100302]: getExceptionDefinition(ExceptionCode.HO100302)?.shortDescription,
  [ExceptionCode.HO100314]: getExceptionDefinition(ExceptionCode.HO100314)?.shortDescription,
  [ExceptionCode.HO100402]: {
    "I1008 - GWAY - ENQUIRY ERROR INVALID ADJUDICATION": "Check the offence matching",
    "I1008 - GWAY - ENQUIRY ERROR MORE THAN 3 DISPOSAL GROUPS": "ENQUIRY ERROR MORE THAN 3 DISPOSAL GROUPS",
    "I1008 - GWAY - ENQUIRY ERROR NO SUITABLE DISPOSAL GROUPS":
      "Create DH page on PNC, then Submit the case on Bichard 7",
    "I1008 - GWAY - ENQUIRY ERROR RECORD CORRUPTION: INCORRECT CHARGE COUNT ON COURT CASE":
      "Check PNC record and re-submit",
    "I1008 - GWAY - ENQUIRY ERROR TOO MANY DISPOSALS": "Check PNC record and re-submit",
    "I1036 - Error encountered processing enquiry": "Re-submit case to the PNC"
  },
  [ExceptionCode.HO100404]: "Unexpected PNC communication error"
}

const getPncExceptionDescription = (code: ExceptionCode, message: string) => {
  if (code === ExceptionCode.HO100402) {
    return Object.entries(pncExceptionDescriptions[code]).find(([pncMessage]) => message.includes(pncMessage))?.[1]
  }

  return pncExceptionDescriptions[code as Exclude<keyof typeof pncExceptionDescriptions, ExceptionCode.HO100402>]
}

const PncException = ({ code, message }: Props) => {
  const classes = useStyles()
  const isPncQueryExceptionCode = [ExceptionCode.HO100302, ExceptionCode.HO100314].includes(code)

  return (
    <div className={`${classes.exceptionRow} moj-exception-row`}>
      <GridRow className="exception-row exception-row__header">
        <GridCol>
          <Badge isRendered={true} colour={"red"} label={"PNC Error"} />
        </GridCol>
      </GridRow>

      <GridRow className="exception-row exception-row__details">
        <GridCol>
          {code}
          {` - PNC ${isPncQueryExceptionCode ? "Query" : "Update"} Error`}
        </GridCol>
      </GridRow>

      <GridRow className="exception-row exception-row__help">
        <GridCol>
          <Accordion id={`exception-${code.toLocaleLowerCase()}`} heading="PNC error message">
            <div className="b7-inset-text">
              <span className="b7-inset-text__heading">{"PNC error message"}</span>
              {getPncExceptionDescription(code, message)}
            </div>
          </Accordion>
          <Link href={`/help/bichard-functionality/exceptions/resolution.html#${code}`} target="_blank">
            {"More information"}
          </Link>
        </GridCol>
      </GridRow>
    </div>
  )
}

export default PncException

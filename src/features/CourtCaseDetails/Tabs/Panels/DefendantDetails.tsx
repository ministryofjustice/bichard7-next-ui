import { HearingDefendant } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import { GenderCode, RemandStatusCode } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import { GenderCodes } from "@moj-bichard7-developers/bichard7-next-data/dist/types/GenderCode"
import { RemandStatuses } from "@moj-bichard7-developers/bichard7-next-data/dist/types/RemandStatusCode"
import { Table } from "govuk-react"
import { TableRow } from "./TableRow"
import { formatDisplayedDate } from "utils/formattedDate"
import { AddressCell } from "./AddressCell"
import { capitalizeString } from "utils/capitaliseString"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import ErrorMessages from "types/ErrorMessages"
import ExceptionFieldTableRow from "components/ExceptionFieldTableRow"
import ErrorPromptMessage from "components/ErrorPromptMessage"
import { BailConditions } from "./BailConditions"
import { createUseStyles } from "react-jss"


interface DefendantDetailsProps {
  defendant: HearingDefendant
  asn: string | null
  exceptions: { code: ExceptionCode; path: (string | number)[] }[]
  courtCase: DisplayFullCourtCase
}

const useStyles = createUseStyles({
  wrapper: {
    "& td": {
      width: "50%"
    }
  }
})

export const DefendantDetails = ({ defendant, asn, exceptions, courtCase }: DefendantDetailsProps) => {
  const classes = useStyles()
  const findUnresolvedException = (exceptionCode: ExceptionCode) =>
    exceptions.find((exception) => exception.code === exceptionCode && courtCase.errorStatus !== "Resolved")
  // need to add logic for HO200114, need to check if you can have both HO200113 and HO200114
  const asnErrorPrompt = findUnresolvedException(ExceptionCode.HO200113) && ErrorMessages.AsnUneditable
    || findUnresolvedException(ExceptionCode.HO200114) && ErrorMessages.AsnUneditable

  return (
    <div className={`Defendant-details-table ${classes.wrapper}`}>
      <Table>
        {
          <>
            {asnErrorPrompt ? (
              <ExceptionFieldTableRow badgeText={"SYSTEM ERROR"} value={asn} badgeColour={"purple"} label={"ASN"}>
                <ErrorPromptMessage message={ErrorMessages.AsnUneditable} />
              </ExceptionFieldTableRow>
            ) : (
              <TableRow label="ASN" value={asn} />
            )}
          </>
        }

        <TableRow label="PNC Check name" value={defendant.PNCCheckname} />
        <TableRow label="Given name" value={defendant.DefendantDetail?.PersonName.GivenName?.join(", ")} />
        <TableRow label="Family name" value={defendant.DefendantDetail?.PersonName.FamilyName} />
        <TableRow label="Title" value={defendant.DefendantDetail?.PersonName.Title} />
        <TableRow label="Date of birth" value={formatDisplayedDate(defendant.DefendantDetail?.BirthDate || "")} />
        <TableRow
          label="Gender"
          value={`${defendant.DefendantDetail?.Gender} (${GenderCodes[defendant.DefendantDetail?.Gender as GenderCode]
            })`}
        />
        <TableRow label="Address" value={<AddressCell address={defendant.Address} />} />
        <TableRow label="PNC file name" value={defendant.DefendantDetail?.GeneratedPNCFilename} />
        <TableRow
          label="Remand status"
          value={capitalizeString(RemandStatuses[defendant.RemandStatus as RemandStatusCode])}
        />
      </Table>
      <BailConditions
        bailConditions={defendant.BailConditions}
        bailReason={defendant.ReasonForBailConditions}
        offences={defendant.Offence}

      />
    </div>
  )
}

import { HearingDefendant } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import { GenderCodes } from "@moj-bichard7-developers/bichard7-next-data/dist/types/GenderCode"
import { RemandStatuses } from "@moj-bichard7-developers/bichard7-next-data/dist/types/RemandStatusCode"
import { GenderCode, RemandStatusCode } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import UneditableField from "components/UneditableField"
import { Table } from "govuk-react"
import ErrorMessages from "types/ErrorMessages"
import { capitalizeString } from "utils/capitaliseString"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import { formatDisplayedDate } from "utils/formattedDate"
import { AddressCell } from "./AddressCell"
import { TableRow } from "./TableRow"

interface DefendantDetailsProps {
  defendant: HearingDefendant
  asn: string | null
  exceptions: { code: ExceptionCode; path: (string | number)[] }[]
  courtCase: DisplayFullCourtCase
}

export const DefendantDetails = ({ defendant, asn, exceptions, courtCase }: DefendantDetailsProps) => {
  // TODO: break out into a reusable function as used in OffenceDetails
  const findUnresolvedException = (exceptionCode: ExceptionCode) =>
    exceptions.find((exception) => exception.code === exceptionCode && courtCase.errorStatus !== "Resolved")
  // need to add logic for HO200114, need to check if you can have both HO200113 and HO200114
  const asnErrorPrompt = findUnresolvedException(ExceptionCode.HO200113) && ErrorMessages.AsnUneditable

  return (
    <Table>
      {
        <>
          {asnErrorPrompt ? (
            <UneditableField
              badge={"SYSTEM ERROR"}
              message={ErrorMessages.AsnUneditable}
              code={asn}
              colour={"purple"}
              label={"ASN"}
            />
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
        value={`${defendant.DefendantDetail?.Gender} (${GenderCodes[defendant.DefendantDetail?.Gender as GenderCode]})`}
      />
      <TableRow label="Address" value={<AddressCell address={defendant.Address} />} />
      <TableRow label="PNC file name" value={defendant.DefendantDetail?.GeneratedPNCFilename} />
      <TableRow
        label="Remand status"
        value={capitalizeString(RemandStatuses[defendant.RemandStatus as RemandStatusCode])}
      />
    </Table>
  )
}

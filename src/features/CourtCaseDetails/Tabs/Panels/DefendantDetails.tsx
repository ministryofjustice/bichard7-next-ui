import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import { GenderCode, RemandStatusCode } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import { GenderCodes } from "@moj-bichard7-developers/bichard7-next-data/dist/types/GenderCode"
import { RemandStatuses } from "@moj-bichard7-developers/bichard7-next-data/dist/types/RemandStatusCode"
import { HintText, Input, Label, Table } from "govuk-react"
import { TableRow } from "./TableRow"
import { formatDisplayedDate } from "utils/formattedDate"
import { AddressCell } from "./AddressCell"
import { capitalizeString } from "utils/valueTransformers"
import { findExceptions } from "types/ErrorMessages"
import ExceptionFieldTableRow from "components/ExceptionFieldTableRow"
import ErrorPromptMessage from "components/ErrorPromptMessage"
import { BailConditions } from "./BailConditions"
import { createUseStyles } from "react-jss"
import { useCourtCase } from "../../../../context/CourtCaseContext"
import { useState } from "react"
import { isAsnFormatValid } from "@moj-bichard7-developers/bichard7-next-core/core/phase1/lib/isAsnValid"
import { AmendmentKeys, AmendmentRecords, IndividualAmendmentValues } from "../../../../types/Amendments"
import ConditionalRender from "../../../../components/ConditionalRender"

interface DefendantDetailsProps {
  amendmentRecords: AmendmentRecords
  amendFn: (keyToAmend: AmendmentKeys) => (newValue: IndividualAmendmentValues) => void
}

type ExceptionCodeMap = {
  badgeText: "System Error" | "Editable Field" | "Added by Court" | "Unmatched"
  systemErrorException?: ExceptionCode
  editableFieldException?: ExceptionCode,
  displayError: boolean
}

const useStyles = createUseStyles({
  wrapper: {
    "& td": {
      width: "50%"
    }
  },
  
  asnInput: {
    width: "15rem",
  }
})

export const DefendantDetails = ({amendFn, amendmentRecords}:DefendantDetailsProps) => {
  const classes = useStyles()
  const courtCase = useCourtCase()
  const defendant = courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
  const systemErrorExceptions: ExceptionCode[] = [ExceptionCode.HO200113, ExceptionCode.HO200114]
  const editableFieldExceptions: ExceptionCode[] = [ExceptionCode.HO100206, ExceptionCode.HO100321]
  const asnErrorPrompt = findExceptions(
    courtCase,
    courtCase.aho.Exceptions,
    systemErrorExceptions
  )

  const [isValidAsn, setIsValidAsn] = useState<boolean>(true);
  const handleAsnChange = (event) => {
    const asn = event.target.value.toUpperCase()
    setIsValidAsn(isAsnFormatValid(asn))
    amendFn("asn")(asn)
  };
  
  const exceptionFromCourtCase = (courtCase) => {
    const exception: ExceptionCodeMap = {
      badgeText: "System Error",
      systemErrorException: undefined,
      editableFieldException: undefined,
      displayError: false
    }

    courtCase.aho.Exceptions.forEach(({ code }) => {
      if (systemErrorExceptions.includes(code)) {
        exception.badgeText = "System Error"
        exception.systemErrorException = code
      }

      if (editableFieldExceptions.includes(code)) {
        exception.badgeText = "Editable Field"
        exception.editableFieldException = code
      }
    })
    exception.displayError = Boolean(exception.systemErrorException) || Boolean(exception.editableFieldException)
    return exception
  }
  
  const asnFormGroupError = isValidAsn ? "" : "govuk-form-group--error"
  const exception = exceptionFromCourtCase(courtCase)
  
  const displayError: boolean = exception.displayError && courtCase.errorStatus === "Unresolved"

  return (
    <div className={`Defendant-details-table ${classes.wrapper}`}>
      <Table>
        <ExceptionFieldTableRow
          badgeText={exception.badgeText}
          value={defendant.ArrestSummonsNumber}
          badgeColour={"purple"}
          label={"ASN"}
          displayError={displayError}
        >
          <ConditionalRender isRendered={Boolean(exception.systemErrorException)} >
            <ErrorPromptMessage message={asnErrorPrompt} />
          </ConditionalRender>
          
          <ConditionalRender isRendered={Boolean(exception.editableFieldException)}>
            <Label>{"Enter the ASN"}</Label>
            <HintText>{"Last 2 digits of year / 4 divisional ID location characters / 2 digits from owning force / 4 digits /  1 check letter "}</HintText>
            <HintText>{"Example: 22 49AB 49 1234 C"}</HintText>
            <div className={`${asnFormGroupError}`}>
              {!isValidAsn &&
                  <p id="event-name-error" className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span> Invalid ASN format
                  </p>
              }
              <Input
                  className={`${classes.asnInput}`}
                  id={"asn"}
                  name={"asn"}
                  onChange={handleAsnChange}
                  value={amendmentRecords.asn ?? ""}
                  error={!isValidAsn}
              />
            </div>
          </ConditionalRender>
        </ExceptionFieldTableRow>

        <TableRow label="PNC Check name" value={defendant.PNCCheckname} />
        <TableRow label="Given name" value={defendant.DefendantDetail?.PersonName.GivenName?.join(", ")} />
        <TableRow label="Family name" value={defendant.DefendantDetail?.PersonName.FamilyName} />
        <TableRow label="Title" value={defendant.DefendantDetail?.PersonName.Title} />
        <TableRow label="Date of birth" value={formatDisplayedDate(defendant.DefendantDetail?.BirthDate || "")} />
        <TableRow
          label="Gender"
          value={`${defendant.DefendantDetail?.Gender} (${
            GenderCodes[defendant.DefendantDetail?.Gender as GenderCode]
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

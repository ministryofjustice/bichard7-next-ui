import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import Phase from "@moj-bichard7-developers/bichard7-next-core/core/types/Phase"
import { GenderCodes } from "@moj-bichard7-developers/bichard7-next-data/dist/types/GenderCode"
import { RemandStatuses } from "@moj-bichard7-developers/bichard7-next-data/dist/types/RemandStatusCode"
import { GenderCode, RemandStatusCode } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import axios from "axios"
import ErrorPromptMessage from "components/ErrorPromptMessage"
import ExceptionFieldTableRow from "components/ExceptionFieldTableRow"
import { ReactiveLinkButton } from "components/LinkButton"
import { HintText, Input, Label, Table } from "govuk-react"
import React, { useCallback, useState } from "react"
import { useBeforeunload } from "react-beforeunload"
import { createUseStyles } from "react-jss"
import Asn from "services/Asn"
import { findExceptions } from "types/ErrorMessages"
import { formatDisplayedDate } from "utils/formattedDate"
import isAsnFormatValid from "utils/isAsnFormatValid"
import { capitalizeString } from "utils/valueTransformers"
import EditableFieldTableRow from "../../../../components/EditableFieldTableRow"
import { useCourtCase } from "../../../../context/CourtCaseContext"
import { AmendmentKeys, AmendmentRecords, IndividualAmendmentValues } from "../../../../types/Amendments"
import { AddressCell } from "./AddressCell"
import { BailConditions } from "./BailConditions"
import { TableRow } from "./TableRow"

interface DefendantDetailsProps {
  amendmentRecords: AmendmentRecords
  amendFn: (keyToAmend: AmendmentKeys) => (newValue: IndividualAmendmentValues) => void
}

const useStyles = createUseStyles({
  wrapper: {
    "& td": {
      width: "50%"
    }
  },

  asnInput: {
    width: "15rem"
  }
})

export const DefendantDetails = ({ amendFn, amendmentRecords }: DefendantDetailsProps) => {
  const classes = useStyles()
  const courtCase = useCourtCase()
  const defendant = courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
  const asnSystemErrorExceptionPrompt = findExceptions(
    courtCase,
    courtCase.aho.Exceptions,
    ExceptionCode.HO200113,
    ExceptionCode.HO200114
  )

  const updatedAsn =
    courtCase.updatedHearingOutcome?.AnnotatedHearingOutcome?.HearingOutcome?.Case?.HearingDefendant
      ?.ArrestSummonsNumber

  const [isAsnChanged, setIsAsnChanged] = useState<boolean>(false)
  const [isValidAsn, setIsValidAsn] = useState<boolean>(false)
  const [savedAsn, setSavedAsn] = useState<boolean>(false)
  const [asnString, setAsnString] = useState<string>("")

  const saveAsn = useCallback(
    async (asn: Asn) => {
      await axios.put(`/bichard/api/court-cases/${courtCase.errorId}/update`, { asn: asn.toString() })
    },
    [courtCase.errorId]
  )

  const handleAsnSave = (): void => {
    if (isValidAsn) {
      setSavedAsn(true)
      console.log("Valid, can be saved")

      console.log("Saving...")
      saveAsn(new Asn(asnString))
    }
  }

  const handleAsnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const asn = e.target.value.toUpperCase()
    setIsValidAsn(isAsnFormatValid(asn))
    setIsAsnChanged(true)
    setAsnString(asn)
    amendFn("asn")(asn)
  }

  useBeforeunload(!savedAsn && isAsnChanged ? (event: BeforeUnloadEvent) => event.preventDefault() : undefined)

  const asnFormGroupError = isValidAsn ? "" : "govuk-form-group--error"

  const hideError = (): boolean => {
    if (asnString.length === 0) {
      return true
    } else {
      return isValidAsn
    }
  }

  const isSaveAsnBtnDisabled = (): boolean => {
    if (isValidAsn && savedAsn) {
      return true
    } else if (!isValidAsn) {
      return true
    } else if (savedAsn) {
      return true
    } else {
      return false
    }
  }

  const isAsnEditable = courtCase.canUserEditExceptions && courtCase.phase === Phase.HEARING_OUTCOME

  return (
    <div className={`Defendant-details-table ${classes.wrapper}`}>
      <Table>
        {asnSystemErrorExceptionPrompt ? (
          <ExceptionFieldTableRow
            badgeText={"System Error"}
            value={defendant.ArrestSummonsNumber}
            badgeColour={"purple"}
            label={"ASN"}
            displayError={!!asnSystemErrorExceptionPrompt}
          >
            <ErrorPromptMessage message={asnSystemErrorExceptionPrompt} />
          </ExceptionFieldTableRow>
        ) : (
          <EditableFieldTableRow
            value={defendant.ArrestSummonsNumber}
            updatedValue={updatedAsn}
            label="ASN"
            hasExceptions={isAsnEditable}
            isEditable={isAsnEditable}
          >
            <Label>{"Enter the ASN"}</Label>
            <HintText>
              {
                "Last 2 digits of year / 4 divisional ID location characters / 2 digits from owning force / 4 digits / 1 check letter "
              }
            </HintText>
            <HintText>{"Example: 22 49AB 49 1234 C"}</HintText>
            <div className={!hideError() ? `${asnFormGroupError}` : ""}>
              {!hideError() && (
                <p id="event-name-error" className="govuk-error-message">
                  <span className="govuk-visually-hidden">{"Error:"}</span> {"Invalid ASN format"}
                </p>
              )}
              <Input
                className={`${classes.asnInput}`}
                id={"asn"}
                name={"asn"}
                onChange={handleAsnChange}
                value={(amendmentRecords.asn as string) ?? ""}
                error={!hideError()}
              />
            </div>
            <ReactiveLinkButton onClick={handleAsnSave} disabled={isSaveAsnBtnDisabled()}>
              {"Save correction"}
            </ReactiveLinkButton>
          </EditableFieldTableRow>
        )}

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

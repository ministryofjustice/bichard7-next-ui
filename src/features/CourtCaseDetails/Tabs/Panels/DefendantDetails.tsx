import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import Phase from "@moj-bichard7-developers/bichard7-next-core/core/types/Phase"
import { GenderCodes } from "@moj-bichard7-developers/bichard7-next-data/dist/types/GenderCode"
import { RemandStatuses } from "@moj-bichard7-developers/bichard7-next-data/dist/types/RemandStatusCode"
import { GenderCode, RemandStatusCode } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import axios from "axios"
import { BadgeColours } from "components/Badge"
import ErrorPromptMessage from "components/ErrorPromptMessage"
import ExceptionFieldTableRow, { ExceptionBadgeType } from "components/ExceptionFieldTableRow"
import { SaveLinkButton } from "components/LinkButton"
import { Input, Table } from "govuk-react"
import React, { useCallback, useEffect, useState } from "react"
import { createUseStyles } from "react-jss"
import Asn from "services/Asn"
import { findExceptions } from "types/ErrorMessages"
import { formatDisplayedDate } from "utils/formattedDate"
import isAsnFormatValid from "utils/isAsnFormatValid"
import { capitalizeString } from "utils/valueTransformers"
import EditableFieldTableRow from "../../../../components/EditableFields/EditableFieldTableRow"
import { useCourtCase } from "../../../../context/CourtCaseContext"
import { AddressCell } from "./AddressCell"
import { BailConditions } from "./BailConditions"
import { TableRow } from "./TableRow"
// TODO: import input mask to format ASN https://www.dhiwise.com/post/react-input-mask-creating-user-friendly-form-inputs & https://npmjs.com/package/react-input-mask
interface DefendantDetailsProps {
  stopLeavingFn: (newValue: boolean) => void
}

const useStyles = createUseStyles({
  wrapper: {
    "& td": {
      width: "50%"
    }
  },

  asnInput: {
    width: "15rem"
  },
  "save-button": {
    marginTop: "0.94rem",
    marginBottom: 0
  }
})

const formatAsn = (input: string) => {
  const sanitized = input.replace(/[^\dA-Z]/gi, "").toUpperCase()
  const regex = /(\d{2})([\dA-Z]{4})(\d{2})(\d{4})([A-Z]{1})/
  const match = sanitized.match(regex)

  console.log({ sanitized, match })

  if (match) {
    console.log("match found")
    return match.slice(1).join("/")
  }
  console.log("no match")
  return input
}

export const DefendantDetails = ({ stopLeavingFn }: DefendantDetailsProps) => {
  const classes = useStyles()
  const { courtCase, amendments, amend } = useCourtCase()
  const defendant = courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
  const asnSystemErrorExceptionPrompt = findExceptions(
    courtCase,
    courtCase.aho.Exceptions,
    ExceptionCode.HO200113,
    ExceptionCode.HO200114
  )

  const [updatedAhoAsn, setUpdatedAhoAsn] = useState<string>(
    courtCase.updatedHearingOutcome?.AnnotatedHearingOutcome?.HearingOutcome?.Case?.HearingDefendant
      ?.ArrestSummonsNumber
  )
  const [isAsnChanged, setIsAsnChanged] = useState<boolean>(false)
  const [isValidAsn, setIsValidAsn] = useState<boolean>(isAsnFormatValid(updatedAhoAsn))
  const [savedAsn, setSavedAsn] = useState<boolean>(false)
  const [asnString, setAsnString] = useState<string>(updatedAhoAsn ?? "")
  const [pageLoad, setPageLoad] = useState<boolean>(false)

  const saveAsn = useCallback(
    async (asn: Asn) => {
      await axios.put(`/bichard/api/court-cases/${courtCase.errorId}/update`, { asn: asn.toString() })
      setSavedAsn(false)
    },
    [courtCase.errorId]
  )

  const handleAsnSave = (): void => {
    if (isValidAsn) {
      setSavedAsn(true)

      saveAsn(new Asn(asnString))
    }
  }

  useEffect(() => {
    if (!pageLoad) {
      amend("asn")(updatedAhoAsn ?? "")
      setPageLoad(true)
    }

    if (savedAsn) {
      setUpdatedAhoAsn(asnString)
    }

    stopLeavingFn(!savedAsn && isAsnChanged && updatedAhoAsn !== asnString)
  }, [savedAsn, asnString, pageLoad, amendments, updatedAhoAsn, stopLeavingFn, isAsnChanged, amend])

  const handleAsnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const asn = e.target.value.toUpperCase()
    const sanitized = asn.replace(/[^\dA-Z]/gi, "").toUpperCase()
    setIsValidAsn(isAsnFormatValid(sanitized))
    setIsAsnChanged(true)
    setAsnString(sanitized)
    amend("asn")(sanitized)
  }

  const asnFormGroupError = isValidAsn ? "" : "govuk-form-group--error"

  const showError = (): boolean => {
    if (asnString.length === 0) {
      return true
    } else {
      return !isValidAsn
    }
  }

  const isSaveAsnBtnDisabled = (): boolean => {
    if (updatedAhoAsn === asnString) {
      return true
    } else if (!isValidAsn) {
      return true
    }

    return false
  }

  const isAsnEditable = courtCase.canUserEditExceptions && courtCase.phase === Phase.HEARING_OUTCOME

  return (
    <div className={`Defendant-details-table ${classes.wrapper}`}>
      <Table>
        {asnSystemErrorExceptionPrompt ? (
          <ExceptionFieldTableRow
            badgeText={ExceptionBadgeType.SystemError}
            value={defendant.ArrestSummonsNumber}
            badgeColour={BadgeColours.Purple}
            label={"ASN"}
            displayError={!!asnSystemErrorExceptionPrompt}
          >
            <ErrorPromptMessage message={asnSystemErrorExceptionPrompt} />
          </ExceptionFieldTableRow>
        ) : (
          <EditableFieldTableRow
            value={defendant.ArrestSummonsNumber}
            updatedValue={updatedAhoAsn}
            label="ASN"
            hasExceptions={isAsnEditable}
            isEditable={isAsnEditable}
          >
            <Label>{"Enter the ASN"}</Label>
            <HintText>{"Long form ASN"}</HintText>
            <HintText>
              {
                "Last 2 digits of year / 4 divisional ID location characters / 2 digits from owning force / 4 digits / 1 check letter "
              }
            </HintText>
            <HintText>{"Example: 22 49AB 49 1234 C"}</HintText>
            <div className={showError() ? `${asnFormGroupError}` : ""}>
              {showError() && (
                <p id="event-name-error" className="govuk-error-message">
                  <span className="govuk-visually-hidden">{"Error:"}</span> {"Invalid ASN format"}
                </p>
              )}
              <Input
                placeholder="22 / 49AB / 49 / 1234 / C"
                type="text"
                inputMode="text"
                className={`${classes.asnInput}`}
                id={"asn"}
                name={"asn"}
                onChange={handleAsnChange}
                value={formatAsn(amendments.asn ?? "")}
                error={!isValidAsn}
              />
            </div>
            <SaveLinkButton id={"save-asn"} onClick={handleAsnSave} disabled={isSaveAsnBtnDisabled()} />
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

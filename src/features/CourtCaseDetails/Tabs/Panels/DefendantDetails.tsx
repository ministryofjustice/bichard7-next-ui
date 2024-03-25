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
import React, { useCallback, useEffect, useState } from "react"
import { createUseStyles } from "react-jss"
import Asn from "services/Asn"
import { findExceptions } from "types/ErrorMessages"
import { formatDisplayedDate } from "utils/formattedDate"
import isAsnFormatValid from "utils/isAsnFormatValid"
import { capitalizeString } from "utils/valueTransformers"
import EditableFieldTableRow from "../../../../components/EditableFieldTableRow"
import { useCourtCase } from "../../../../context/CourtCaseContext"
import { AddressCell } from "./AddressCell"
import { BailConditions } from "./BailConditions"
import { TableRow } from "./TableRow"

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
      amendments.asn = updatedAhoAsn ?? ""
      setPageLoad(true)
    }

    if (savedAsn) {
      setUpdatedAhoAsn(asnString)
    }

    stopLeavingFn(!savedAsn && isAsnChanged && updatedAhoAsn !== asnString)
  }, [savedAsn, asnString, pageLoad, amendments, updatedAhoAsn, stopLeavingFn, isAsnChanged])

  const handleAsnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const asn = e.target.value.toUpperCase()
    setIsValidAsn(isAsnFormatValid(asn))
    setIsAsnChanged(true)
    setAsnString(asn)
    amend("asn")(asn)
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
            updatedValue={updatedAhoAsn}
            label="ASN"
            hasExceptions={isAsnEditable}
            isEditable={isAsnEditable}
          >
            <Label>{"Enter the ASN"}</Label>
            <HintText>{"Long form ASN"}</HintText>
            {/* <HintText>
              {
                "Last 2 digits of year / 4 divisional ID location characters / 2 digits from owning force / 4 digits / 1 check letter "
              }
            </HintText>
            <HintText>{"Example: 22 49AB 49 1234 C"}</HintText> */}
            <div className={showError() ? `${asnFormGroupError}` : ""}>
              {showError() && (
                <p id="event-name-error" className="govuk-error-message">
                  <span className="govuk-visually-hidden">{"Error:"}</span> {"Invalid ASN format"}
                </p>
              )}
              <Input
                className={`${classes.asnInput}`}
                id={"asn"}
                name={"asn"}
                onChange={handleAsnChange}
                value={(amendments.asn as string) ?? ""}
                error={!isValidAsn}
              />
            </div>
            <ReactiveLinkButton
              id={"save-asn"}
              className={classes["save-button"]}
              onClick={handleAsnSave}
              disabled={isSaveAsnBtnDisabled()}
            >
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

import axios from "axios"
import EditableFieldTableRow from "components/EditableFields/EditableFieldTableRow"
import { SaveLinkButton } from "components/LinkButton"
import { useCourtCase } from "context/CourtCaseContext"
import { useState, useCallback, useEffect } from "react"
import Asn from "services/Asn"
import isAsnFormatValid from "utils/isAsnFormatValid"
import { AsnInput } from "../DefendantDetails.styles"
import Phase from "@moj-bichard7-developers/bichard7-next-core/core/types/Phase"

interface AsnFieldProps {
  stopLeavingFn: (newValue: boolean) => void
}

export const AsnField = ({ stopLeavingFn }: AsnFieldProps) => {
  const { courtCase, amendments, amend } = useCourtCase()
  const defendant = courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant

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
    <EditableFieldTableRow
      value={defendant.ArrestSummonsNumber}
      updatedValue={updatedAhoAsn}
      label="ASN"
      hasExceptions={isAsnEditable}
      isEditable={isAsnEditable}
      inputLabel={"Enter the ASN"}
      // hintText={`Last 2 digits of year / 4 divisional ID location characters / 2 digits from owning force / 4 \
      // digits / 1 check letter\nExample: 22 49AB 49 1234 C`}
      hintText="Long form ASN"
    >
      <div className={showError() ? `${asnFormGroupError}` : ""}>
        {showError() && (
          <p id="event-name-error" className="govuk-error-message">
            <span className="govuk-visually-hidden">{"Error:"}</span> {"Invalid ASN format"}
          </p>
        )}
        <AsnInput
          className={`asn-input`}
          id={"asn"}
          name={"asn"}
          onChange={handleAsnChange}
          value={amendments.asn ?? ""}
          error={!isValidAsn}
        />
      </div>
      <SaveLinkButton id={"save-asn"} onClick={handleAsnSave} disabled={isSaveAsnBtnDisabled()} />
    </EditableFieldTableRow>
  )
}

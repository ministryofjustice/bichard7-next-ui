import Phase from "@moj-bichard7-developers/bichard7-next-core/core/types/Phase"
import axios from "axios"
import EditableFieldTableRow from "components/EditableFields/EditableFieldTableRow"
import { SaveLinkButton } from "components/LinkButton"
import { useCourtCase } from "context/CourtCaseContext"
import { useCallback, useEffect, useState, KeyboardEvent, ClipboardEvent } from "react"
import Asn from "services/Asn"
import isAsnFormatValid from "utils/isAsnFormatValid"
import isAsnException from "utils/exceptions/isException/isAsnException"
import { useCurrentUser } from "context/CurrentUserContext"
import { CheckmarkIcon } from "../../CourtCaseDetailsSingleTab.styles"
import { CHECKMARK_ICON_URL } from "utils/icons"
import { AsnInputContainer, AsnInput } from "./AsnField.styles"
import { isEmpty } from "lodash"

interface AsnFieldProps {
  stopLeavingFn: (newValue: boolean) => void
}

export const AsnField = ({ stopLeavingFn }: AsnFieldProps) => {
  const { courtCase, amendments, amend, savedAmend } = useCourtCase()
  const currentUser = useCurrentUser()
  const defendant = courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
  const amendedAsn = amendments.asn ?? ""

  const [updatedAhoAsn, setUpdatedAhoAsn] = useState<string>(
    courtCase.updatedHearingOutcome?.AnnotatedHearingOutcome?.HearingOutcome?.Case?.HearingDefendant
      ?.ArrestSummonsNumber
  )
  const [isValidAsn, setIsValidAsn] = useState<boolean>(isAsnFormatValid(updatedAhoAsn))
  const [isSavedAsn, setIsSavedAsn] = useState<boolean>(false)
  const [isPageLoaded, setIsPageLoaded] = useState<boolean>(false)
  const [key, setKey] = useState<string>("")

  useEffect(() => {
    if (!isPageLoaded) {
      amend("asn")(updatedAhoAsn ?? "")
      setIsPageLoaded(true)
    }

    if (isSavedAsn) {
      setUpdatedAhoAsn(amendedAsn)
    }

    stopLeavingFn(!isSavedAsn && !isEmpty(amendedAsn) && updatedAhoAsn !== amendedAsn)
  }, [isSavedAsn, isPageLoaded, amendments, updatedAhoAsn, stopLeavingFn, amend, amendedAsn])

  const saveAsn = useCallback(
    async (asn: Asn) => {
      await axios.put(`/bichard/api/court-cases/${courtCase.errorId}/update`, { asn: asn.toString() })
      setIsSavedAsn(false)
    },
    [courtCase.errorId]
  )

  const handleAsnSave = (): void => {
    if (isValidAsn) {
      setIsSavedAsn(true)
      savedAmend("asn")(amendedAsn)
      saveAsn(new Asn(amendedAsn))
    }
  }

  const handleOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Backspace") {
      setKey(e.code)
    }
  }

  const handleAsnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const inputAsnValue = e.target.value.toUpperCase()

    if (key === "Backspace") {
      const asnWithSlashes = Asn.divideAsn(inputAsnValue)
      amend("asn")(Asn.deleteAsn(asnWithSlashes))
    } else {
      const asnWithoutSlashes = inputAsnValue.replace(/\//g, "")
      amend("asn")(asnWithoutSlashes)
    }

    setIsValidAsn(isAsnFormatValid(inputAsnValue))
  }

  const handleOnPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const asnFromClipboard = e.clipboardData.getData("text")
    setIsValidAsn(isAsnFormatValid(asnFromClipboard))
    amend("asn")(asnFromClipboard)
  }

  const handleOnCopy = () => {
    const copiedAsn = document.getSelection()?.toString().replace(/\//g, "")
    navigator.clipboard.writeText(copiedAsn ?? "")
  }

  const isSaveAsnBtnDisabled = (): boolean => {
    if (updatedAhoAsn === amendedAsn) {
      return true
    } else if (!isValidAsn) {
      return true
    }
    return false
  }

  const isAsnEditable =
    courtCase.canUserEditExceptions &&
    courtCase.phase === Phase.HEARING_OUTCOME &&
    isAsnException(courtCase.aho.Exceptions) &&
    currentUser.featureFlags?.exceptionsEnabled

  const asn =
    amendedAsn.includes("/") || (amendedAsn.length <= 2 && key === "Backspace") ? amendedAsn : Asn.divideAsn(amendedAsn)

  return (
    <EditableFieldTableRow
      value={defendant.ArrestSummonsNumber}
      updatedValue={updatedAhoAsn}
      label="ASN"
      hasExceptions={isAsnEditable}
      isEditable={isAsnEditable}
      inputLabel={"Enter the ASN"}
      hintText="ASN format: Last 2 digits of year / 4 divisional ID location characters / 2 digits from owning force / 1 to 11 digits and 1 check letter \n Example: 22/49AB/49/1234C"
    >
      <div className={isValidAsn ? "" : "govuk-form-group--error"}>
        {!isValidAsn && (
          <p id="event-name-error" className="govuk-error-message">
            <span className="govuk-visually-hidden">{"Error:"}</span> {"Enter ASN in the correct format"}
          </p>
        )}
        <AsnInputContainer>
          <AsnInput
            className={`asn-input`}
            id={"asn"}
            name={"asn"}
            onChange={handleAsnChange}
            value={asn}
            error={!isValidAsn}
            onKeyDown={handleOnKeyDown}
            onPaste={handleOnPaste}
            onCopy={handleOnCopy}
            onCut={handleOnCopy}
          />
          {isValidAsn && (
            <CheckmarkIcon
              className={`checkmark-icon checkmark`}
              src={CHECKMARK_ICON_URL}
              width={30}
              height={30}
              alt="Checkmark icon"
            />
          )}
        </AsnInputContainer>
      </div>
      <SaveLinkButton id={"save-asn"} onClick={handleAsnSave} disabled={isSaveAsnBtnDisabled()} />
    </EditableFieldTableRow>
  )
}

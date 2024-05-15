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

interface AsnFieldProps {
  stopLeavingFn: (newValue: boolean) => void
}

export const AsnField = ({ stopLeavingFn }: AsnFieldProps) => {
  const { courtCase, amendments, amend, savedAmend } = useCourtCase()
  const currentUser = useCurrentUser()
  const defendant = courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
  const splitUpdatedAhoAsn = Asn.divideAsn(
    courtCase.updatedHearingOutcome?.AnnotatedHearingOutcome?.HearingOutcome?.Case?.HearingDefendant
      ?.ArrestSummonsNumber
  )

  const [updatedAhoAsn, setUpdatedAhoAsn] = useState<string>(splitUpdatedAhoAsn)
  const [isAsnChanged, setIsAsnChanged] = useState<boolean>(false)
  const [isValidAsn, setIsValidAsn] = useState<boolean>(isAsnFormatValid(updatedAhoAsn))
  const [savedAsn, setSavedAsn] = useState<boolean>(false)
  const [asnString, setAsnString] = useState<string>(updatedAhoAsn ?? "")
  const [pageLoad, setPageLoad] = useState<boolean>(false)
  const [key, setKey] = useState<string>("")

  const saveAsn = useCallback(
    async (asn: Asn) => {
      console.log(asn.toString())

      await axios.put(`/bichard/api/court-cases/${courtCase.errorId}/update`, { asn: asn.toString() })
      setSavedAsn(false)
    },
    [courtCase.errorId]
  )

  const handleAsnSave = (): void => {
    if (isValidAsn) {
      setSavedAsn(true)
      savedAmend("asn")(asnString)
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

  let asn = ""
  const handleAsnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    asn = Asn.divideAsn(e.target.value.toUpperCase())

    if (key === "Backspace") {
      asn = Asn.deleteAsn(asn)
    }

    setIsValidAsn(isAsnFormatValid(asn))
    setIsAsnChanged(true)
    setAsnString(asn)
    amend("asn")(asn)
  }

  const handleOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    setKey(e.code)
  }

  const handleOnPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const asnFromClipboard = e.clipboardData.getData("text")
    setIsValidAsn(isAsnFormatValid(asnFromClipboard))
    setIsAsnChanged(true)
    setAsnString(Asn.divideAsn(asnFromClipboard))
    amend("asn")(Asn.divideAsn(asnFromClipboard))
  }

  const handleOnCopy = () => {
    const copiedAsn = document.getSelection()?.toString().replace(/\//g, "")
    navigator.clipboard.writeText(copiedAsn ?? "")
  }

  const isSaveAsnBtnDisabled = (): boolean => {
    const formattedAsn = asnString.includes("/") ? asnString : Asn.divideAsn(asnString)
    if (updatedAhoAsn === formattedAsn) {
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

  return (
    <EditableFieldTableRow
      value={defendant.ArrestSummonsNumber}
      updatedValue={updatedAhoAsn}
      label="ASN"
      hasExceptions={isAsnEditable}
      isEditable={isAsnEditable}
      inputLabel={"Enter the ASN"}
      hintText="Last 2 digits of year / 4 divisional ID location characters / 2 digits from owning force / 4 digits / 1 check letter\nExample: 22 49AB 49 1234 C"
    >
      <div className={isValidAsn ? "" : "govuk-form-group--error"}>
        {!isValidAsn && (
          <p id="event-name-error" className="govuk-error-message">
            <span className="govuk-visually-hidden">{"Error:"}</span> {"Invalid ASN format"}
          </p>
        )}
        <AsnInputContainer>
          <AsnInput
            className={`asn-input`}
            id={"asn"}
            name={"asn"}
            onChange={handleAsnChange}
            value={amendments.asn ?? ""}
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

import Phase from "@moj-bichard7-developers/bichard7-next-core/core/types/Phase"
import axios from "axios"
import EditableFieldTableRow from "components/EditableFields/EditableFieldTableRow"
import { SaveLinkButton } from "components/LinkButton"
import { useCourtCase } from "context/CourtCaseContext"
import { useCallback, useEffect, useState, KeyboardEvent, ClipboardEvent } from "react"
import Asn from "services/Asn"
import isAsnFormatValid from "utils/isAsnFormatValid"
import { AsnInput } from "../DefendantDetails.styles"
import isAsnException from "utils/exceptions/isException/isAsnException"
import { useCurrentUser } from "context/CurrentUserContext"

interface AsnFieldProps {
  stopLeavingFn: (newValue: boolean) => void
}

export const AsnField = ({ stopLeavingFn }: AsnFieldProps) => {
  const { courtCase, amendments, amend, savedAmend } = useCourtCase()
  const currentUser = useCurrentUser()
  const defendant = courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant

  const splitAsn = (asn: string | undefined): string => {
    if (asn) {
      return asn
        .replace(/\//g, "")
        .split("")
        .map((el, i) => {
          if (i === 1 || i === 5 || i === 7) {
            return `${el}/`
          } else {
            return el
          }
        })
        .join("")
    }
    return ""
  }

  const splitUpdatedAhoAsn = splitAsn(
    courtCase.updatedHearingOutcome?.AnnotatedHearingOutcome?.HearingOutcome?.Case?.HearingDefendant
      ?.ArrestSummonsNumber
  )

  const [updatedAhoAsn, setUpdatedAhoAsn] = useState<string>(splitUpdatedAhoAsn)

  const [isAsnChanged, setIsAsnChanged] = useState<boolean>(false)
  const [isValidAsn, setIsValidAsn] = useState<boolean>(isAsnFormatValid(updatedAhoAsn.replace(/\//g, "")))
  const [savedAsn, setSavedAsn] = useState<boolean>(false)
  const [asnString, setAsnString] = useState<string>(updatedAhoAsn ?? "")
  const [pageLoad, setPageLoad] = useState<boolean>(false)
  const [key, setKey] = useState<string>("")

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
    asn = e.target.value.toUpperCase()

    if (key === "Backspace") {
      switch (asn.length) {
        case 10:
          asn = asn.substring(0, 9)
          break
        case 7:
          asn = asn.substring(0, 6)
          break
        case 2:
          asn = asn.substring(0, 1)
          break
        default:
          break
      }
    } else if (asn.length === 2 || asn.length === 7 || asn.length === 10) {
      asn = asn + "/"
    }

    const unsplitAsn = asn.replace(/\//g, "")
    setIsValidAsn(isAsnFormatValid(unsplitAsn))
    setIsAsnChanged(true)
    setAsnString(unsplitAsn)
    amend("asn")(asn)
  }

  const handleOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    setKey(e.code)
  }

  const handleOnPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const asnFromClipboard = e.clipboardData.getData("text")
    amend("asn")(splitAsn(asnFromClipboard))
    setIsValidAsn(isAsnFormatValid(asnFromClipboard))
  }

  const isSaveAsnBtnDisabled = (): boolean => {
    const formattedAsn = asnString.includes("/") ? asnString : splitAsn(asnString)
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
      // hintText={`Last 2 digits of year / 4 divisional ID location characters / 2 digits from owning force / 4 \
      // digits / 1 check letter\nExample: 22 49AB 49 1234 C`}
      hintText="Last 2 digits of year / 4 divisional ID location characters / 2 digits from owning force / 4 digits / 1 check letter\nExample: 22 49AB 49 1234 C"
    >
      <div className={isValidAsn ? "" : "govuk-form-group--error"}>
        {!isValidAsn && (
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
          onKeyDown={handleOnKeyDown}
          onPaste={handleOnPaste}
        />
      </div>
      <SaveLinkButton id={"save-asn"} onClick={handleAsnSave} disabled={isSaveAsnBtnDisabled()} />
    </EditableFieldTableRow>
  )
}

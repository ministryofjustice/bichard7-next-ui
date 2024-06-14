import Phase from "@moj-bichard7-developers/bichard7-next-core/core/types/Phase"
import axios from "axios"
import EditableFieldTableRow from "components/EditableFields/EditableFieldTableRow"
import { useCourtCase } from "context/CourtCaseContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { KeyboardEvent, useCallback, useEffect, useState } from "react"
import Asn from "services/Asn"
import isAsnFormatValid from "utils/exceptions/isAsnFormatValid"
import isAsnException from "utils/exceptions/isException/isAsnException"
import { AsnInput } from "./AsnField.styles"
import SuccessMessage from "../../../../../components/EditableFields/SuccessMessage"

export const AsnField = () => {
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

  const saveAsn = useCallback(
    async (asn: Asn) => {
      await axios.put(`/bichard/api/court-cases/${courtCase.errorId}/update`, { asn: asn.toString() })
    },
    [courtCase.errorId]
  )

  const handleAsnSave = useCallback((): void => {
    if (isValidAsn) {
      setIsSavedAsn(true)
      savedAmend("asn")(amendedAsn)
      saveAsn(new Asn(amendedAsn))
    }
  }, [amendedAsn, isValidAsn, saveAsn, savedAmend])

  useEffect(() => {
    if (!isPageLoaded) {
      amend("asn")(updatedAhoAsn ?? "")
      setIsPageLoaded(true)
    }

    if (isSavedAsn) {
      setUpdatedAhoAsn(amendedAsn)
    } else {
      handleAsnSave()
    }
  }, [isSavedAsn, isPageLoaded, amendments, updatedAhoAsn, amend, amendedAsn, handleAsnSave, isValidAsn])

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
    setIsSavedAsn(false)
    setIsValidAsn(isAsnFormatValid(inputAsnValue))
  }

  const handleOnCopy = () => {
    const copiedAsn = document.getSelection()?.toString().replace(/\//g, "")
    navigator.clipboard.writeText(copiedAsn ?? "")
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
        <div>
          <AsnInput
            className={`asn-input`}
            id={"asn"}
            name={"asn"}
            onChange={handleAsnChange}
            value={asn}
            error={!isValidAsn}
            onKeyDown={handleOnKeyDown}
            onCopy={handleOnCopy}
            onCut={handleOnCopy}
          />
        </div>
        {isSavedAsn && <SuccessMessage message="Input saved" />}
      </div>
    </EditableFieldTableRow>
  )
}

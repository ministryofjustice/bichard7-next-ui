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
import ErrorMessage from "components/EditableFields/ErrorMessage"

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
  const [httpResponseStatus, setHttpResponseStatus] = useState<number>(0)

  const saveAsn = useCallback(
    async (asn: Asn) => {
      await axios
        .put(`/bichard/api/court-cases/${courtCase.errorId}/update`, { asn: asn.toString() })
        .then((response) => {
          setHttpResponseStatus(response.status)
        })
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
    setHttpResponseStatus(0)
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
      <div>
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
        {httpResponseStatus === 202 && <SuccessMessage message="Input saved" />}
        {!isValidAsn && <ErrorMessage message="Enter ASN in the correct format" />}
      </div>
    </EditableFieldTableRow>
  )
}

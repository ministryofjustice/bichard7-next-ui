import Phase from "@moj-bichard7-developers/bichard7-next-core/core/types/Phase"
import { AutoSave } from "components/EditableFields/AutoSave"
import EditableFieldTableRow from "components/EditableFields/EditableFieldTableRow"
import ErrorMessage from "components/EditableFields/ErrorMessage"
import { useCourtCase } from "context/CourtCaseContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { KeyboardEvent, useState } from "react"
import Asn from "services/Asn"
import isAsnFormatValid from "utils/exceptions/isAsnFormatValid"
import isAsnException from "utils/exceptions/isException/isAsnException"
import { AsnInput } from "./AsnField.styles"

export const AsnField = () => {
  const { courtCase, amendments, amend } = useCourtCase()
  const currentUser = useCurrentUser()
  const defendant = courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
  const amendedAsn = amendments.asn ?? ""
  const updatedAhoAsn =
    courtCase.updatedHearingOutcome?.AnnotatedHearingOutcome?.HearingOutcome?.Case?.HearingDefendant
      ?.ArrestSummonsNumber

  const [isValidAsn, setIsValidAsn] = useState<boolean>(isAsnFormatValid(amendedAsn))
  const [isSavedAsn, setIsSavedAsn] = useState<boolean>(false)
  const [asnChanged, setAsnChanged] = useState<boolean>(false)
  const [key, setKey] = useState<string>("")

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
    setAsnChanged(true)
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
      id={"asn-row"}
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
        <AutoSave
          setChanged={setAsnChanged}
          setSaved={setIsSavedAsn}
          isValid={isValidAsn}
          amendmentFields={["asn"]}
          isChanged={asnChanged}
          isSaved={isSavedAsn}
        >
          {!isValidAsn && <ErrorMessage message="Enter ASN in the correct format" />}
        </AutoSave>
      </div>
    </EditableFieldTableRow>
  )
}

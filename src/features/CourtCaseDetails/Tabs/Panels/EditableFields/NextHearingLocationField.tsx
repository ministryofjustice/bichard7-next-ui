import { Result } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import axios from "axios"
import EditableFieldTableRow from "components/EditableFields/EditableFieldTableRow"
import { SaveLinkButton } from "components/LinkButton"
import OrganisationUnitTypeahead from "components/OrganisationUnitTypeahead"
import { useCourtCase } from "context/CourtCaseContext"
import { useCallback, useEffect, useState } from "react"
import OrganisationUnitApiResponse from "types/OrganisationUnitApiResponse"
import { Exception } from "types/exceptions"
import getNextHearingLocationValue from "utils/amendments/getAmendmentValues/getNextHearingLocationValue"
import hasNextHearingLocationException from "utils/exceptions/hasNextHearingLocationException"
import isValidNextHearingLocation from "utils/validators/isValidNextHearingLocation"

interface NextHearingLocationFieldProps {
  result: Result
  exceptions: Exception[]
  offenceIndex: number
  resultIndex: number
  isCaseEditable: boolean
}

export const NextHearingLocationField = ({
  result,
  exceptions,
  offenceIndex,
  resultIndex,
  isCaseEditable
}: NextHearingLocationFieldProps) => {
  const { courtCase, amendments } = useCourtCase()
  const amendedNextHearingLocation = getNextHearingLocationValue(amendments, offenceIndex, resultIndex)

  const nextHearingLocation =
    courtCase.updatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex]
      .Result[resultIndex].NextResultSourceOrganisation?.OrganisationUnitCode

  const [savedNextHearingLocation, setSavedNextHearingLocation] = useState<string>(nextHearingLocation ?? "")
  const [isNhlSaved, setIsNhlSaved] = useState<boolean>(false)
  const [organisations, setOrganisations] = useState<OrganisationUnitApiResponse>([])
  const [isNhlChanged, setIsNhlChanged] = useState<boolean>(false)

  const saveNhl = useCallback(async () => {
    await axios.put(`/bichard/api/court-cases/${courtCase.errorId}/update`, {
      nextSourceOrganisation: amendments.nextSourceOrganisation
    })

    setIsNhlSaved(true)
    setIsNhlChanged(false)

    const nextSourceOrganisationAmendments = amendments.nextSourceOrganisation
    setSavedNextHearingLocation(nextSourceOrganisationAmendments ? nextSourceOrganisationAmendments[0].value ?? "" : "")
  }, [amendments.nextSourceOrganisation, courtCase.errorId])

  const isSaveNhlBtnDisabled = (): boolean => {
    return !isValidNextHearingLocation(amendedNextHearingLocation, organisations) || isNhlSaved || !isNhlChanged
  }

  const handleNhlSave = () => {
    if (isValidNextHearingLocation(amendedNextHearingLocation, organisations)) {
      saveNhl()
    }
  }

  useEffect(() => {
    if (amendedNextHearingLocation !== savedNextHearingLocation) {
      setIsNhlChanged(true)
      setIsNhlSaved(false)
    } else {
      setIsNhlChanged(false)
    }
  }, [amendedNextHearingLocation, savedNextHearingLocation])

  return (
    <EditableFieldTableRow
      label="Next hearing location"
      hasExceptions={hasNextHearingLocationException(exceptions)}
      value={result.NextResultSourceOrganisation?.OrganisationUnitCode}
      updatedValue={amendedNextHearingLocation}
      isEditable={isCaseEditable && hasNextHearingLocationException(exceptions)}
      inputLabel="Enter next hearing location"
      hintText="OU code, 6-7 characters"
    >
      <OrganisationUnitTypeahead
        value={amendedNextHearingLocation ?? result.NextResultSourceOrganisation?.OrganisationUnitCode}
        resultIndex={resultIndex}
        offenceIndex={offenceIndex}
        setOrganisations={setOrganisations}
      />

      <SaveLinkButton id={"save-next-hearing-location"} onClick={handleNhlSave} disabled={isSaveNhlBtnDisabled()} />
    </EditableFieldTableRow>
  )
}

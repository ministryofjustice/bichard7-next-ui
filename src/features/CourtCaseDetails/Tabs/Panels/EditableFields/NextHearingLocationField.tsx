import { useCallback, useState } from "react"
import axios from "axios"
import EditableFieldTableRow from "components/EditableFields/EditableFieldTableRow"
import { Result } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { Exception } from "types/exceptions"
import hasNextHearingLocationException from "utils/exceptions/hasNextHearingLocationException"
import getNextHearingLocationValue from "utils/amendments/getAmendmentValues/getNextHearingLocationValue"
import { useCourtCase } from "context/CourtCaseContext"
import OrganisationUnitTypeahead from "components/OrganisationUnitTypeahead"
import { SaveLinkButton } from "components/LinkButton"
import OrganisationUnitApiResponse from "types/OrganisationUnitApiResponse"
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
  const updatedNextHearingLocation = getNextHearingLocationValue(amendments, offenceIndex, resultIndex)

  const savedNextHearingLocation =
    courtCase.updatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex]
      .Result[resultIndex].NextResultSourceOrganisation?.OrganisationUnitCode

  const [isNhlSaved, setIsNhlSaved] = useState<boolean>(false)
  const [organisations, setOrganisations] = useState<OrganisationUnitApiResponse>([])
  const [isNhlChanged, setIsNhlChanged] = useState<boolean>(false)

  const saveNhl = useCallback(async () => {
    await axios.put(`/bichard/api/court-cases/${courtCase.errorId}/update`, {
      nextSourceOrganisation: amendments.nextSourceOrganisation
    })
    setIsNhlSaved(true)
    setIsNhlChanged(false)
  }, [amendments.nextSourceOrganisation, courtCase.errorId])

  const isSaveNhlBtnDisabled = (): boolean => {
    return (
      !isValidNextHearingLocation(amendedNextHearingLocation, organisations) ||
      isNhlSaved ||
      !isNhlChanged ||
      amendedNextHearingLocation === savedNextHearingLocation
    )
  }

  const handleNhlSave = () => {
    saveNhl()
  }

  return (
    <EditableFieldTableRow
      label="Next hearing location"
      hasExceptions={hasNextHearingLocationException(exceptions)}
      value={result.NextResultSourceOrganisation?.OrganisationUnitCode}
      updatedValue={updatedNextHearingLocation}
      isEditable={isCaseEditable && hasNextHearingLocationException(exceptions)}
      inputLabel="Enter next hearing location"
      hintText="OU code, 6-7 characters"
    >
      <OrganisationUnitTypeahead
        value={
          amendedNextHearingLocation ??
          updatedNextHearingLocation ??
          result.NextResultSourceOrganisation?.OrganisationUnitCode
        }
        resultIndex={resultIndex}
        offenceIndex={offenceIndex}
        setOrganisations={setOrganisations}
        setIsNhlChanged={setIsNhlChanged}
        setIsNhlSaved={setIsNhlSaved}
      />
      <SaveLinkButton id={"save-next-hearing-location"} onClick={handleNhlSave} disabled={isSaveNhlBtnDisabled()} />
    </EditableFieldTableRow>
  )
}

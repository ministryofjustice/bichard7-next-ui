import { Result } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import axios from "axios"
import EditableFieldTableRow from "components/EditableFields/EditableFieldTableRow"
import ErrorMessage from "components/EditableFields/ErrorMessage"
import SuccessMessage from "components/EditableFields/SuccessMessage"
import OrganisationUnitTypeahead from "components/OrganisationUnitTypeahead"
import { useCourtCase } from "context/CourtCaseContext"
import { useCurrentUser } from "context/CurrentUserContext"
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
  const { courtCase, amendments, savedAmend } = useCourtCase()
  const currentUser = useCurrentUser()
  const amendedNextHearingLocation = getNextHearingLocationValue(amendments, offenceIndex, resultIndex)
  const nextHearingLocation =
    courtCase.updatedHearingOutcome?.AnnotatedHearingOutcome?.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex]
      .Result[resultIndex].NextResultSourceOrganisation?.OrganisationUnitCode

  const [savedNextHearingLocation, setSavedNextHearingLocation] = useState<string>(nextHearingLocation ?? "")
  const [isNhlSaved, setIsNhlSaved] = useState<boolean>(false)
  const [organisations, setOrganisations] = useState<OrganisationUnitApiResponse>([])
  const [isNhlChanged, setIsNhlChanged] = useState<boolean>(false)
  const [httpResponseStatus, setHttpResponseStatus] = useState<number | undefined>(undefined)
  const [httpResponseError, setHttpResponseError] = useState<Error | undefined>(undefined)

  const isValidNhl = isValidNextHearingLocation(amendedNextHearingLocation, organisations)

  const saveNhl = useCallback(async () => {
    try {
      await axios
        .put(`/bichard/api/court-cases/${courtCase.errorId}/update`, {
          nextSourceOrganisation: amendments.nextSourceOrganisation
        })
        .then((response) => {
          setHttpResponseStatus(response.status)
        })
    } catch (error) {
      setHttpResponseError(error as Error)
    }

    setIsNhlSaved(true)
    setIsNhlChanged(false)

    const nextSourceOrganisationAmendments = amendments.nextSourceOrganisation
    setSavedNextHearingLocation(nextSourceOrganisationAmendments ? nextSourceOrganisationAmendments[0].value ?? "" : "")
  }, [amendments.nextSourceOrganisation, courtCase.errorId])

  const handleNhlSave = useCallback(() => {
    if (!isValidNhl) {
      return
    }

    saveNhl()
    savedAmend("nextSourceOrganisation")({
      resultIndex: resultIndex,
      offenceIndex: offenceIndex,
      value: amendedNextHearingLocation
    })
  }, [amendedNextHearingLocation, isValidNhl, offenceIndex, resultIndex, saveNhl, savedAmend])

  useEffect(() => {
    if (amendedNextHearingLocation && amendedNextHearingLocation !== savedNextHearingLocation) {
      setIsNhlChanged(true)
      setIsNhlSaved(false)
    } else {
      setIsNhlChanged(false)
    }

    if (!isNhlSaved && isNhlChanged) {
      handleNhlSave()
      setHttpResponseError(undefined)
    }

    if (!isValidNhl) {
      setHttpResponseStatus(undefined)
    }
  }, [amendedNextHearingLocation, handleNhlSave, isNhlChanged, isNhlSaved, isValidNhl, savedNextHearingLocation])

  const isEditable =
    isCaseEditable && hasNextHearingLocationException(exceptions) && currentUser.featureFlags?.exceptionsEnabled

  return (
    <EditableFieldTableRow
      label="Next hearing location"
      hasExceptions={hasNextHearingLocationException(exceptions)}
      value={result.NextResultSourceOrganisation?.OrganisationUnitCode}
      updatedValue={amendedNextHearingLocation}
      isEditable={isEditable}
      inputLabel="Enter next hearing location"
      hintText="OU code, 6-7 characters"
    >
      <OrganisationUnitTypeahead
        value={amendedNextHearingLocation ?? result.NextResultSourceOrganisation?.OrganisationUnitCode}
        resultIndex={resultIndex}
        offenceIndex={offenceIndex}
        setOrganisations={setOrganisations}
      />
      {!isValidNhl && <ErrorMessage message="Select valid Next hearing location" />}
      {httpResponseStatus === 202 && <SuccessMessage message="Input saved" />}
      {httpResponseError && <ErrorMessage message="Autosave has failed, please refresh" />}
    </EditableFieldTableRow>
  )
}

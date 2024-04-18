import EditableFieldTableRow from "components/EditableFields/EditableFieldTableRow"
import { Result } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { Exception } from "types/exceptions"
import hasNextHearingLocationException from "utils/exceptions/hasNextHearingLocationException"
import getNextHearingLocationValue from "utils/amendments/getAmendmentValues/getNextHearingLocationValue"
import { useCourtCase } from "context/CourtCaseContext"
import OrganisationUnitTypeahead from "components/OrganisationUnitTypeahead"

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
  const { amendments } = useCourtCase()

  const amendedNextHearingLocation = getNextHearingLocationValue(amendments, offenceIndex, resultIndex)
  const updatedNextHearingLocation = getNextHearingLocationValue(amendments, offenceIndex, resultIndex)

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
      />
    </EditableFieldTableRow>
  )
}

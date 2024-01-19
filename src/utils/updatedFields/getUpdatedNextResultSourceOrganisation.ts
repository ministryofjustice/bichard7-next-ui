import { Result } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { AmendmentRecords } from "../../types/Amendments"
import setAmendedField from "../amendments/setAmendedField"
import { hasUpdate } from "./hasUpdate"

const getUpdatedNextResultSourceOrganisation = (
  result: Result,
  updatedOffenceResult: Result,
  offenceIndex: number,
  resultIndex: number,
  updatedFields: AmendmentRecords
) => {
  const updatedNextResultSourceOrganisation = updatedOffenceResult?.NextResultSourceOrganisation?.OrganisationUnitCode

  if (hasUpdate(result.NextResultSourceOrganisation?.OrganisationUnitCode, updatedNextResultSourceOrganisation)) {
    setAmendedField(
      "nextSourceOrganisation",
      { resultIndex, offenceIndex, updatedValue: updatedNextResultSourceOrganisation! },
      updatedFields
    )
  }
}

export default getUpdatedNextResultSourceOrganisation

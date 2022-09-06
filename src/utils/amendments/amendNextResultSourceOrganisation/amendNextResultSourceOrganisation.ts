import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import amendDefendantOrOffenceResult from "../amendDefendantOrOffenceResult"
import { UpdatedOffenceResult, ValidProperties } from "types/Amendments"

const amendNextResultSourceOrganisation = (
  { updatedValue, resultIndex, offenceIndex }: UpdatedOffenceResult,
  aho: AnnotatedHearingOutcome
) => {
  const amendedSourceOrganisation = {
    ...(updatedValue.length >= 1 && { TopLevelCode: updatedValue.substring(0, 1) }),
    SecondLevelCode: updatedValue.length >= 3 ? updatedValue.substring(1, 3) : null,
    ThirdLevelCode: updatedValue.length >= 5 ? updatedValue.substring(3, 5) : null,
    BottomLevelCode: updatedValue.length >= 6 ? updatedValue.substring(5, 6) : null,
    OrganisationUnitCode: updatedValue
  }

  return amendDefendantOrOffenceResult(
    { offenceIndex, resultIndex },
    aho,
    ValidProperties.NextResultSourceOrganisation,
    amendedSourceOrganisation
  )
}

export default amendNextResultSourceOrganisation

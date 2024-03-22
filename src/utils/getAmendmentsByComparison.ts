import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { Amendments } from "types/Amendments"
import { formatFormInputDateString } from "utils/formattedDate"

const getAmendmentsByComparison = (aho: AnnotatedHearingOutcome, updatedAho?: AnnotatedHearingOutcome): Amendments => {
  const amendments: Amendments = {}

  if (!updatedAho) {
    return amendments
  }

  const hearingDefendant = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
  const updatedHearingDefendant = updatedAho?.AnnotatedHearingOutcome?.HearingOutcome?.Case?.HearingDefendant

  if (
    hearingDefendant.ArrestSummonsNumber &&
    updatedHearingDefendant?.ArrestSummonsNumber &&
    hearingDefendant.ArrestSummonsNumber !== updatedHearingDefendant?.ArrestSummonsNumber
  ) {
    amendments.asn = updatedHearingDefendant?.ArrestSummonsNumber
  }

  hearingDefendant.Offence.forEach((offence, offenceIndex) => {
    offence.Result.forEach((result, resultIndex) => {
      const updatedOffence = updatedHearingDefendant?.Offence && updatedHearingDefendant?.Offence[offenceIndex]
      const updatedOffenceResults = updatedOffence && updatedOffence?.Result
      const updatedOffenceResult = updatedOffenceResults && updatedOffenceResults[resultIndex]

      const nextResultSourceOrganisation = result.NextResultSourceOrganisation?.OrganisationUnitCode
      const updatedNextResultSourceOrganisation =
        updatedOffenceResult?.NextResultSourceOrganisation?.OrganisationUnitCode
      if (
        nextResultSourceOrganisation &&
        updatedNextResultSourceOrganisation &&
        nextResultSourceOrganisation !== updatedNextResultSourceOrganisation
      ) {
        amendments.nextSourceOrganisation = amendments.nextSourceOrganisation || []
        amendments.nextSourceOrganisation.push({
          resultIndex,
          offenceIndex,
          value: updatedNextResultSourceOrganisation!
        })
      }

      const updatedNextHearingDate = updatedOffenceResult?.NextHearingDate
      const nextHearingDate = result.NextHearingDate
      if (updatedNextHearingDate && nextHearingDate && updatedNextHearingDate !== nextHearingDate) {
        amendments.nextHearingDate = amendments.nextHearingDate || []
        amendments.nextHearingDate.push({
          resultIndex,
          offenceIndex,
          value: formatFormInputDateString(new Date(updatedNextHearingDate!))
        })
      }
    })
  })

  return amendments
}

export default getAmendmentsByComparison

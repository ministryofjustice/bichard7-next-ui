import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { AmendmentRecords } from "../../types/Amendments"
import getUpdatedAsn from "./getUpdatedAsn"
import getUpdatedNextResultSourceOrganisation from "./getUpdatedNextResultSourceOrganisation"
import getUpdatedNextHearingDate from "./getUpdatedNextHearingDate"

const getUpdatedFields = (aho: AnnotatedHearingOutcome, updatedAho?: AnnotatedHearingOutcome): AmendmentRecords => {
  const updatedFields: AmendmentRecords = {}

  if (!updatedAho) {
    return updatedFields
  }

  const hearingDefendant = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
  const updatedHearingDefendant = updatedAho?.AnnotatedHearingOutcome?.HearingOutcome?.Case?.HearingDefendant

  getUpdatedAsn(hearingDefendant, updatedHearingDefendant, updatedFields)

  hearingDefendant.Offence.forEach((offence, offenceIndex) => {
    offence.Result.forEach((result, resultIndex) => {
      const updatedOffence = updatedHearingDefendant?.Offence && updatedHearingDefendant?.Offence[offenceIndex]
      const updatedOffenceResults = updatedOffence && updatedOffence?.Result
      const updatedOffenceResult = updatedOffenceResults && updatedOffenceResults[resultIndex]

      getUpdatedNextResultSourceOrganisation(result, updatedOffenceResult, offenceIndex, resultIndex, updatedFields)
      getUpdatedNextHearingDate(result, updatedOffenceResult, offenceIndex, resultIndex, updatedFields)
    })
  })

  return updatedFields
}

export default getUpdatedFields

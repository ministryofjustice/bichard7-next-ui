import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { AmendmentRecords } from "../../types/Amendments"
import setAmendedField from "./setAmendedField"
import { formatFormInputDateString } from "../formattedDate"

const hasUpdate = (originalValue?: string | Date | null, updatedValue?: string | Date | null): boolean =>
  !!updatedValue && updatedValue !== originalValue

const getUpdatedFields = (aho: AnnotatedHearingOutcome, updatedAho?: AnnotatedHearingOutcome): AmendmentRecords => {
  const updatedFields: AmendmentRecords = {}

  if (!updatedAho) {
    return updatedFields
  }

  const hearingDefendant = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
  const updatedHearingDefendant = updatedAho?.AnnotatedHearingOutcome?.HearingOutcome?.Case?.HearingDefendant

  if (hasUpdate(hearingDefendant.ArrestSummonsNumber, updatedHearingDefendant?.ArrestSummonsNumber)) {
    setAmendedField("asn", updatedHearingDefendant.ArrestSummonsNumber, updatedFields)
  }

  hearingDefendant.Offence.forEach((offence, offenceIndex) => {
    offence.Result.forEach((result, resultIndex) => {
      const updatedOffence = updatedHearingDefendant?.Offence && updatedHearingDefendant?.Offence[offenceIndex]
      const updatedOffenceResults = updatedOffence && updatedOffence?.Result
      const updatedOffenceResult = updatedOffenceResults && updatedOffenceResults[resultIndex]

      const updatedNextResultSourceOrganisation =
        updatedOffenceResult?.NextResultSourceOrganisation?.OrganisationUnitCode
      const updatedNextHearingDate = updatedOffenceResult?.NextHearingDate

      if (hasUpdate(result.NextHearingDate, updatedNextHearingDate)) {
        setAmendedField(
          "nextHearingDate",
          {
            resultIndex,
            offenceIndex,
            updatedValue: formatFormInputDateString(new Date(updatedNextHearingDate!))
          },
          updatedFields
        )
      }
      if (hasUpdate(result.NextResultSourceOrganisation?.OrganisationUnitCode, updatedNextResultSourceOrganisation)) {
        setAmendedField(
          "nextSourceOrganisation",
          { resultIndex, offenceIndex, updatedValue: updatedNextResultSourceOrganisation! },
          updatedFields
        )
      }
    })
  })

  return updatedFields
}

export default getUpdatedFields

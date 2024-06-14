import { Amendments } from "types/Amendments"
import offenceMatcherValue from "./offenceMatcherSelectValue"

const offenceAlreadySelected = (
  amendments: Amendments,
  offenceIndex: number,
  sequenceNumber: number,
  courtCaseReference: string
): boolean => {
  const knownMatches: string[] = []

  amendments.offenceCourtCaseReferenceNumber?.forEach((offenceCcr) => {
    const offenceReasonSequence = amendments.offenceReasonSequence?.find(
      (a) => a.offenceIndex === offenceCcr.offenceIndex && a.offenceIndex !== offenceIndex
    )

    if (offenceReasonSequence?.value) {
      knownMatches.push(offenceMatcherValue(offenceReasonSequence.value, offenceCcr.value))
    }
  })

  return knownMatches.includes(offenceMatcherValue(sequenceNumber, courtCaseReference))
}

export default offenceAlreadySelected

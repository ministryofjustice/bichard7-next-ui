import {
  AmendmentKeys,
  AmendmentValues,
  IndividualAmendmentValues,
  UpdatedNextHearingDate
} from "../../types/Amendments"

const setNextHearingDate = (
  newValue: IndividualAmendmentValues,
  amendments: Record<string, AmendmentValues>
): Record<string, AmendmentValues> => {
  const nextHearingDate = amendments.nextHearingDate as UpdatedNextHearingDate[]
  const newHearingDate = newValue as UpdatedNextHearingDate

  if (!nextHearingDate || !Array.isArray(nextHearingDate)) {
    amendments.nextHearingDate = [newValue] as AmendmentValues

    return amendments
  }

  const existingAmendment = nextHearingDate.find(
    (update) =>
      (update as UpdatedNextHearingDate).offenceIndex === newHearingDate.offenceIndex &&
      (update as UpdatedNextHearingDate).resultIndex === newHearingDate.resultIndex
  )

  if (existingAmendment) {
    existingAmendment.updatedValue = newHearingDate.updatedValue
  } else {
    nextHearingDate.push(newHearingDate)
  }

  return amendments
}

const setAmendedField = (
  keyToAmend: AmendmentKeys,
  newValue: IndividualAmendmentValues,
  amendments: Record<string, AmendmentValues>
): Record<string, AmendmentValues> => {
  switch (keyToAmend) {
    case "nextHearingDate":
      amendments = setNextHearingDate(newValue, amendments)
      break
    // TODO: handle other editable fields here
    default:
      amendments[keyToAmend] = newValue as AmendmentValues
  }

  return amendments
}

export default setAmendedField

import {
  AmendmentKeys,
  AmendmentRecords,
  AmendmentValues,
  IndividualAmendmentValues,
  UpdatedNextHearingDate,
  UpdatedOffenceResult
} from "../../types/Amendments"

const findExistingAmendment = (
  amendment: UpdatedNextHearingDate[] | UpdatedOffenceResult[],
  newValue: UpdatedNextHearingDate | UpdatedOffenceResult
) =>
  amendment.find(
    (update) =>
      (update as UpdatedNextHearingDate).offenceIndex === newValue.offenceIndex &&
      (update as UpdatedNextHearingDate).resultIndex === newValue.resultIndex
  )

const setNextHearingDate = (newValue: IndividualAmendmentValues, amendments: AmendmentRecords): AmendmentRecords => {
  const nextHearingDate = amendments.nextHearingDate as UpdatedNextHearingDate[]
  const newHearingDate = newValue as UpdatedNextHearingDate

  if (!nextHearingDate) {
    amendments.nextHearingDate = [newValue] as AmendmentValues

    return amendments
  }

  const existingAmendment = findExistingAmendment(nextHearingDate, newHearingDate)

  if (existingAmendment) {
    existingAmendment.updatedValue = newHearingDate.updatedValue
  } else {
    nextHearingDate.push(newHearingDate)
  }

  return amendments
}

const setNextSourceOrganisation = (
  newValue: IndividualAmendmentValues,
  amendments: AmendmentRecords
): AmendmentRecords => {
  const nextSourceOrganisation = amendments.nextSourceOrganisation as UpdatedOffenceResult[]
  const newNextSourceOrganisation = newValue as UpdatedOffenceResult

  if (!nextSourceOrganisation) {
    amendments.nextSourceOrganisation = [newValue] as AmendmentValues

    return amendments
  }

  const existingAmendment = findExistingAmendment(nextSourceOrganisation, newNextSourceOrganisation)

  if (existingAmendment) {
    existingAmendment.updatedValue = newNextSourceOrganisation.updatedValue
  } else {
    nextSourceOrganisation.push(newNextSourceOrganisation)
  }

  return amendments
}

const setAmendedField = (
  keyToAmend: AmendmentKeys,
  newValue: IndividualAmendmentValues,
  amendments: AmendmentRecords
): AmendmentRecords => {
  switch (keyToAmend) {
    case "nextHearingDate":
      amendments = setNextHearingDate(newValue, amendments)
      break
    case "nextSourceOrganisation":
      amendments = setNextSourceOrganisation(newValue, amendments)
      break
    // TODO: handle other editable fields here
    default:
      amendments[keyToAmend] = newValue as AmendmentValues
  }

  return amendments
}

export default setAmendedField

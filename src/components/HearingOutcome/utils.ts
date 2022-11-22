import { AmendmentArrValues, AmendmentValues, IndividualAmendmentArrValues } from "types/Amendments"

const isAmendmentArrValue = (value: AmendmentValues, indexToUpdate: number): value is AmendmentArrValues =>
  (value as AmendmentArrValues)[indexToUpdate].updatedValue !== undefined

export const isAmendmentArr = (value: AmendmentValues): value is AmendmentArrValues => typeof value !== "string"

export const isAmendmentValue = (value: unknown): value is AmendmentValues => {
  if (typeof value === "string") {
    return true
  }

  // if it's an array with these specific keys on then it's also an AmendmentValues
  return Array.isArray(value) ? value.every((v) => "offenceIndex" in v && "updatedValue" in v) : false
}

// check to see if an object for this value already exists
export const doesUpdateExist = (
  amendmentsArr: AmendmentArrValues,
  incomingValue: IndividualAmendmentArrValues
): number =>
  amendmentsArr.findIndex((existingUpdate: IndividualAmendmentArrValues) => {
    const correctOffenceIdx = existingUpdate.offenceIndex === incomingValue.offenceIndex

    if ("resultIndex" in incomingValue && correctOffenceIdx) {
      if ("resultIndex" in existingUpdate) {
        if (existingUpdate.resultIndex === incomingValue.resultIndex) {
          return correctOffenceIdx
        } else {
          return -1
        }
      }
    }

    return correctOffenceIdx
  })

export const appendNewValue = (
  newArrValue: IndividualAmendmentArrValues,
  keyToAmend: string,
  indexToUpdate: number,
  amendmentsObj: Record<string, AmendmentValues>
) => {
  if (indexToUpdate > -1 && isAmendmentArrValue(amendmentsObj[keyToAmend], indexToUpdate)) {
    // updated the existing object
    ;(amendmentsObj[keyToAmend] as AmendmentArrValues)[indexToUpdate].updatedValue = newArrValue.updatedValue
    return [...amendmentsObj[keyToAmend].slice()]
  }

  // it doesn't already exist so append it
  return [...amendmentsObj[keyToAmend].slice(), newArrValue]
}

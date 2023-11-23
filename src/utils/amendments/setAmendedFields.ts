import { isObject } from "lodash"
import {
  appendNewValue,
  doesUpdateExist,
  isAmendmentArr,
  isAmendmentValue
} from "../../components/HearingOutcome/utils"
import { AmendmentArrValues, AmendmentValues, IndividualAmendmentValues } from "../../types/Amendments"

const setAmendedFields = (
  keyToAmend: string,
  newValue: IndividualAmendmentValues,
  amendments: Record<string, AmendmentValues>
): Record<string, AmendmentValues> => {
  const updatedIdx =
    Array.isArray(amendments[keyToAmend]) && isAmendmentArr(amendments[keyToAmend]) && isObject(newValue)
      ? doesUpdateExist(amendments[keyToAmend] as AmendmentArrValues, newValue)
      : -1

  const updatedArr =
    Array.isArray(amendments[keyToAmend]) && isObject(newValue)
      ? appendNewValue(newValue, keyToAmend, updatedIdx, amendments)
      : [newValue]
  const updatedValue = isObject(newValue) ? updatedArr : newValue

  return {
    ...amendments,
    ...(isAmendmentValue(updatedValue) && { [keyToAmend]: updatedValue })
  }
}

export default setAmendedFields

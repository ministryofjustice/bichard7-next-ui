import { AmendmentRecords } from "../types/Amendments"
import { DisplayFullCourtCase } from "../types/display/CourtCases"
import asnValidationError from "./asnValidationError"
import nextHearingDateValidationError from "./nextHearingDateValidationError"
import nextHearingLocationValidationError from "./nextHearingLocationValidationError"

const editableFieldsValidationError = (courtCase: DisplayFullCourtCase, amendments: AmendmentRecords): boolean => {
  const exceptions = courtCase.aho.Exceptions
  if (exceptions.length === 0) {
    return false
  }

  return (
    nextHearingDateValidationError(exceptions, amendments) &&
    nextHearingLocationValidationError(exceptions, amendments) &&
    asnValidationError(exceptions, amendments, courtCase)
  )
}

export default editableFieldsValidationError

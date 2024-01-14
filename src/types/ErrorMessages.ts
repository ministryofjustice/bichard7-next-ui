import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import { DisplayFullCourtCase } from "./display/CourtCases"
import { Exception } from "./exceptions"

enum ErrorMessages {
  QualifierCode = "This code could not be recognised, contact the courts to verify the correct information and report to the Bichard 7 team. Resolve exception by manually updating the PNC with correct code.",
  HO100251ErrorPrompt = "This code is not valid, contact the courts to correct offence code.",
  HO100306ErrorPrompt = "This code could not be recognised. If this is a new offence code update the PNC and mark the case as manually resolved. Otherwise if this offence code is incorrect contact the courts to correct it.",
  HO200113 = "The PNC cannot be updated automatically because there are new remands together with sentencing. Please resolve this exception by manually updating the PNC with correct code.",
  HO200114 = "The PNC cannot be updated automatically because there are changes to existing disposals together with sentencing. Please resolve this exception by manually updating the PNC with correct code.",
  HO100307 = "This code could not be found via look-up, report the issue to Bichard 7 team and the courts for the correct so that they can investigate this issue and advise."
}

const findExceptions = (
  courtCase: DisplayFullCourtCase,
  ahoExceptions: Exception[],
  ...exceptions: ExceptionCode[]
) => {
  // exceptions: [H0100307]
  if (courtCase.errorStatus === "Resolved") {
    return undefined
  }

  const exception = ahoExceptions.find(({ code }) => exceptions.includes(code))

  return exception ? ErrorMessages[exception.code as keyof typeof ErrorMessages] : undefined
}

export default ErrorMessages
export { findExceptions }

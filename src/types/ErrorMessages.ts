enum ErrorMessages {
  QualifierCode = "This code could not be recognised, contact the courts to verify the correct information and report to the Bichard 7 team. Resolve exception by manually updating the PNC with correct code.",
  HO100251ErrorPrompt = "This code is not valid, contact the courts to correct offence code.",
  HO100306ErrorPrompt = "This code could not be recognised. If this is a new offence code update the PNC and mark the case as manually resolved. Otherwise if this offence code is incorrect contact the courts to correct it.",
  AsnUneditable = "The PNC cannot be updated automatically because there are changes to existing disposals together with sentencing. Please resolve this exception by manually updating the PNC with correct code."
}

export default ErrorMessages

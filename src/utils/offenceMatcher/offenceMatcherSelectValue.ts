const offenceMatcherSelectValue = (
  offenceReasonSequence: number | string,
  offenceCourtCaseReferenceNumber: string | undefined
): string => {
  if (offenceCourtCaseReferenceNumber === undefined || offenceCourtCaseReferenceNumber === "") {
    return `${offenceReasonSequence}`
  }

  return `${offenceReasonSequence}-${offenceCourtCaseReferenceNumber}`
}

export default offenceMatcherSelectValue

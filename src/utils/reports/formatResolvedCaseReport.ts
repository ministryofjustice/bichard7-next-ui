import { DisplayFullCourtCase } from "types/display/CourtCases"

export interface ResolvedCaseReportCase {
  ASN: string | null
  PTIURN: string
  defendantName: string | null
  courtName: string
  hearingDate: string
  caseReference: string
  dateTimeRecievedByCJSE: string
  dateTimeResolved: string
  notes: string[]
  resolutionAction: string
}

export default (courtCases: DisplayFullCourtCase[]): ResolvedCaseReportCase[] => {
  return courtCases.map((courtCase) => ({
    ASN: courtCase.asn,
    PTIURN: courtCase.ptiurn,
    defendantName: courtCase.defendantName,
    courtName: courtCase.courtName,
    hearingDate: courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing.toISOString(),
    caseReference: courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber || "",
    dateTimeRecievedByCJSE: "",
    dateTimeResolved: courtCase.resolutionTimestamp || "",
    notes: [],
    resolutionAction: ""
  }))
}

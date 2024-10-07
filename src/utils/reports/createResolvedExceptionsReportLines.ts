import CourtCase from "services/entities/CourtCase"
import parseAhoXml from "@moj-bichard7-developers/bichard7-next-core/core/lib/parse/parseAhoXml/parseAhoXml"
import { isError } from "lodash"

export interface ResolvedExceptionsReportLine {
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

export const createResolvedExceptionsReportLines = (courtCases: CourtCase[]): ResolvedExceptionsReportLine[] =>
  courtCases.map((courtCase) => {
    const aho = parseAhoXml(courtCase.hearingOutcome)

    const reportLine = {
      ASN: courtCase.asn,
      PTIURN: courtCase.ptiurn,
      defendantName: courtCase.defendantName,
      courtName: courtCase.courtName,
      hearingDate: "",
      caseReference: "",
      dateTimeRecievedByCJSE: courtCase.messageReceivedTimestamp?.toISOString() || "",
      dateTimeResolved: courtCase.resolutionTimestamp?.toISOString() || "",
      notes: courtCase.notes.map((note) => `${note.user}: ${note.noteText}`),
      resolutionAction:
        courtCase.notes.sort((a, b) => a.createdAt.valueOf() - b.createdAt.valueOf()).pop()?.noteText || ""
    }

    if (!isError(aho)) {
      reportLine.hearingDate = aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing.toISOString() || ""
      reportLine.caseReference = aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber || ""
    }

    return reportLine
  })

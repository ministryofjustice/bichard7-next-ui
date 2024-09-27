import CourtCase from "services/entities/CourtCase"
import parseAhoXml from "@moj-bichard7-developers/bichard7-next-core/core/lib/parse/parseAhoXml/parseAhoXml"
import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
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
    let aho: AnnotatedHearingOutcome | null = null

    if (courtCase.hearingOutcome) {
      aho = parseAhoXml(courtCase.hearingOutcome) as AnnotatedHearingOutcome
    }

    // TODO: handle errors from parsing ahoXML
    if (isError(aho)) {
      throw aho
    }

    return {
      ASN: courtCase.asn,
      PTIURN: courtCase.ptiurn,
      defendantName: courtCase.defendantName,
      courtName: courtCase.courtName,
      hearingDate: aho ? aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing.toISOString() : "",
      caseReference: aho ? aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber || "" : "",
      dateTimeRecievedByCJSE: courtCase.messageReceivedTimestamp?.toISOString() || "",
      dateTimeResolved: courtCase.resolutionTimestamp?.toISOString() || "",
      notes: courtCase.notes.map((note) => `${note.user}: ${note.noteText}`),
      resolutionAction:
        courtCase.notes.sort((a, b) => a.createdAt.valueOf() - b.createdAt.valueOf()).pop()?.noteText || ""
    }
  })

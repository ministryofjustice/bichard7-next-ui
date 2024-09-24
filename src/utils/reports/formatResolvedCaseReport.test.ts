import formatResolvedCaseReport from "./formatResolvedCaseReport"
import type { ResolvedCaseReportCase } from "./formatResolvedCaseReport"
import fs from "fs"
import generateAho from "../../../test/helpers/generateAho"
import CourtCase from "services/entities/CourtCase"

describe("formatResolvedCourtCasesReport", () => {
  it("returns a list of resolved court cases", () => {
    const ahoXml = fs.readFileSync("test/test-data/AnnotatedHOTemplate.xml").toString()
    const date = new Date()
    const courtCases = [
      {
        asn: "asn",
        ptiurn: "ptiurn",
        triggerCount: 1,
        courtCode: "court-code",
        courtName: "court-name",
        errorId: 1,
        errorReport: "error-report",
        errorStatus: "Resolved",
        errorLockedByUserFullName: "error-locked-by-user-full-name",
        errorLockedByUsername: "error-locked-by-user-name",
        isUrgent: false,
        defendantName: "defendant-name",
        resolutionTimestamp: date,
        messageReceivedTimestamp: date,
        hearingOutcome: generateAho({
          firstName: "first-name",
          lastName: "last-name",
          ahoTemplate: ahoXml,
          ptiurn: "ptirun",
          courtName: "court-name"
        }),
        notes: [
          {
            noteText: "note text",
            user: "user",
            createdAt: new Date("21-2-2024")
          },
          {
            noteText: "resolved text",
            user: "user2",
            createdAt: new Date("21-3-2024")
          }
        ]
      }
    ] as unknown as CourtCase[]

    const result = formatResolvedCaseReport(courtCases)

    expect(result).toEqual([
      {
        ASN: "asn",
        PTIURN: "ptiurn",
        defendantName: "defendant-name",
        courtName: "court-name",
        hearingDate: "2011-09-26T00:00:00.000Z",
        caseReference: "97/1626/008395Q",
        dateTimeRecievedByCJSE: date.toISOString(),
        dateTimeResolved: date.toISOString(),
        notes: ["user: note text", "user2: resolved text"],
        resolutionAction: "resolved text"
      }
    ] as ResolvedCaseReportCase[])
  })
})

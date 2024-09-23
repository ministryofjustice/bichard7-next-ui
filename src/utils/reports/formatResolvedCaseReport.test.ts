import { DisplayFullCourtCase } from "types/display/CourtCases"
import formatResolvedCaseReport from "./formatResolvedCaseReport"
import type { ResolvedCaseReportCase } from "./formatResolvedCaseReport"
import fs from "fs"
import generateAho from "../../../test/helpers/generateAho"
import parseAhoXml from "@moj-bichard7-developers/bichard7-next-core/core/lib/parse/parseAhoXml/parseAhoXml"

describe("formatResolvedCourtCasesReport", () => {
  it("returns a list of resolved court cases", () => {
    const ahoXml = fs.readFileSync("test/test-data/AnnotatedHOTemplate.xml").toString()
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
        resolutionTimestamp: "2024-09-23T15:50:49.110Z",
        aho: parseAhoXml(
          generateAho({
            firstName: "first-name",
            lastName: "last-name",
            ahoTemplate: ahoXml,
            ptiurn: "ptirun",
            courtName: "court-name"
          })
        )
      }
    ] as unknown as DisplayFullCourtCase[]

    const result = formatResolvedCaseReport(courtCases)

    expect(result).toEqual([
      {
        ASN: "asn",
        PTIURN: "ptiurn",
        defendantName: "defendant-name",
        courtName: "court-name",
        hearingDate: "2011-09-26T00:00:00.000Z",
        caseReference: "97/1626/008395Q",
        dateTimeRecievedByCJSE: "date-time-recieved-by-cjse",
        dateTimeResolved: "2024-09-23T15:50:49.110Z",
        notes: ["note"],
        resolutionAction: "resolution-action"
      }
    ] as ResolvedCaseReportCase[])
  })
})

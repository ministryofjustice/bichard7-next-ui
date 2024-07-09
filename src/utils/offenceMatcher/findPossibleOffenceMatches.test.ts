import { PncOffence } from "@moj-bichard7-developers/bichard7-next-core/core/types/PncQueryResult"
import { Offence } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import findPossibleOffenceMatches from "./findPossibleOffenceMatches"
import { DisplayFullCourtCase } from "../../types/display/CourtCases"
import { PossibleMatchingOffence } from "../../types/OffenceMatching"

describe("findPossibleOffenceMatches", () => {
  it("should return an empty offences array if offence codes do not match", () => {
    const caseReference = "case-reference"
    const pncOffence = { offence: { cjsOffenceCode: "nonMatchingOffenceCode" } } as PncOffence
    const offence = {
      CriminalProsecutionReference: {
        OffenceReason: { __type: "NationalOffenceReason", OffenceCode: { FullCode: "offenceCode" } }
      }
    } as Offence
    const courtCase = {
      aho: {
        PncQuery: {
          courtCases: [
            {
              courtCaseReference: caseReference,
              offences: [pncOffence]
            }
          ]
        },
        AnnotatedHearingOutcome: {
          HearingOutcome: {
            Hearing: { DateOfHearing: new Date() },
            Case: {
              HearingDefendant: { Offence: [offence] }
            }
          }
        }
      }
    } as DisplayFullCourtCase

    const result = findPossibleOffenceMatches(courtCase, 0)
    expect(result[0].courtCaseReference).toEqual(caseReference)
    expect(result[0].offences).toEqual([])
  })

  it("should return an empty offences array if offence codes match but dates do not match", () => {
    const pncOffence = { offence: { cjsOffenceCode: "offenceCode", startDate: new Date("1990-01-01") } } as PncOffence
    const offence = {
      ActualOffenceStartDate: { StartDate: new Date("1990-02-01") },
      CriminalProsecutionReference: {
        OffenceReason: { __type: "NationalOffenceReason", OffenceCode: { FullCode: "offenceCode" } }
      }
    } as Offence
    const caseReference = "case-reference"

    const courtCase = {
      aho: {
        PncQuery: {
          courtCases: [
            {
              courtCaseReference: caseReference,
              offences: [pncOffence]
            }
          ]
        },
        AnnotatedHearingOutcome: {
          HearingOutcome: {
            Hearing: { DateOfHearing: new Date() },
            Case: {
              HearingDefendant: { Offence: [offence] }
            }
          }
        }
      }
    } as DisplayFullCourtCase

    const result = findPossibleOffenceMatches(courtCase, 0)
    expect(result[0].courtCaseReference).toEqual(caseReference)
    expect(result[0].offences).toEqual([])
  })

  it("should return the matching offence if both offence codes and dates match", () => {
    const pncOffence = { offence: { cjsOffenceCode: "offenceCode", startDate: new Date("1990-01-01") } } as PncOffence
    const offence = {
      ActualOffenceStartDate: { StartDate: new Date("1990-01-01") },
      CriminalProsecutionReference: {
        OffenceReason: { __type: "NationalOffenceReason", OffenceCode: { FullCode: "offenceCode" } }
      }
    } as Offence

    const courtCase = {
      aho: {
        PncQuery: {
          courtCases: [
            {
              courtCaseReference: "caseReference",
              offences: [pncOffence]
            }
          ]
        },
        AnnotatedHearingOutcome: {
          HearingOutcome: {
            Hearing: { DateOfHearing: new Date() },
            Case: {
              HearingDefendant: { Offence: [offence] }
            }
          }
        }
      }
    } as DisplayFullCourtCase

    const result = findPossibleOffenceMatches(courtCase, 0)

    expect(result).toHaveLength(1)
    expect((result as PossibleMatchingOffence[])[0].courtCaseReference)
    expect((result as PossibleMatchingOffence[])[0].offences[0].offence.cjsOffenceCode).toEqual("offenceCode")
  })
})

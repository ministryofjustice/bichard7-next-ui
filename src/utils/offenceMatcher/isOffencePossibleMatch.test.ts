import { PncOffence } from "@moj-bichard7-developers/bichard7-next-core/core/types/PncQueryResult"
import createDummyAho from "../../../test/helpers/createDummyAho"
import isOffencePossibleMatch from "./isOffencePossibleMatch"
import { Offence } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"

describe("isOffencePossibleMatch", () => {
  it("should return false if offence codes do not match", () => {
    const hearingOutcome = createDummyAho().AnnotatedHearingOutcome.HearingOutcome
    const pncOffence = { offence: { cjsOffenceCode: "nonMatchingOffenceCode" } } as PncOffence
    const offence = {
      CriminalProsecutionReference: {
        OffenceReason: { __type: "NationalOffenceReason", OffenceCode: { FullCode: "offenceCode" } }
      }
    } as Offence

    const caseReference = "case-reference"

    const result = isOffencePossibleMatch(hearingOutcome, pncOffence, offence, caseReference)

    expect(result).toBe(false)
  })

  it("should return false if offence codes match but dates do not", () => {
    const hearingOutcome = createDummyAho().AnnotatedHearingOutcome.HearingOutcome
    const pncOffence = { offence: { cjsOffenceCode: "offenceCode", startDate: new Date("1990-01-01") } } as PncOffence
    const offence = {
      ActualOffenceStartDate: { StartDate: new Date("1990-02-01") },
      CriminalProsecutionReference: {
        OffenceReason: { __type: "NationalOffenceReason", OffenceCode: { FullCode: "offenceCode" } }
      }
    } as Offence

    const caseReference = "case-reference"

    const result = isOffencePossibleMatch(hearingOutcome, pncOffence, offence, caseReference)

    expect(result).toBe(false)
  })

  it("should return true if offence codes and dates match", () => {
    const hearingOutcome = createDummyAho().AnnotatedHearingOutcome.HearingOutcome
    const pncOffence = { offence: { cjsOffenceCode: "offenceCode", startDate: new Date("1990-01-01") } } as PncOffence
    const offence = {
      ActualOffenceStartDate: { StartDate: new Date("1990-01-01") },
      CriminalProsecutionReference: {
        OffenceReason: { __type: "NationalOffenceReason", OffenceCode: { FullCode: "offenceCode" } }
      }
    } as Offence

    const caseReference = "case-reference"

    const result = isOffencePossibleMatch(hearingOutcome, pncOffence, offence, caseReference)

    expect(result).toBe(true)
  })
})

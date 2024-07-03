import { PncOffence } from "@moj-bichard7-developers/bichard7-next-core/core/types/PncQueryResult"
import createDummyAho from "../../../test/helpers/createDummyAho"
import isCaseMatch from "./isCaseMatch"
import { Offence } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"

describe("isCaseMatch", () => {
  it("should return false if offence codes do not match", () => {
    const hearingOutcome = createDummyAho().AnnotatedHearingOutcome.HearingOutcome
    const pncOffence = { offence: { cjsOffenceCode: "nonMatchingOffenceCode" } } as PncOffence
    const offence = {
      CriminalProsecutionReference: {
        OffenceReason: { __type: "NationalOffenceReason", OffenceCode: { FullCode: "offenceCode" } }
      }
    } as Offence

    const caseReference = "case-reference"

    const result = isCaseMatch(hearingOutcome, pncOffence, offence, caseReference)

    expect(result).toBe(false)
  })
})

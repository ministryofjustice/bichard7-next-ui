import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import createDummyAho from "../../../../test/helpers/createDummyAho"
import amendCourtPncIdentifier from "./amendCourtPncIdentifier"

describe("court PNC identifier", () => {
  const aho = createDummyAho() as AnnotatedHearingOutcome

  it("amend court pnc identifier", () => {
    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.CourtPNCIdentifier).toBe(undefined)

    amendCourtPncIdentifier("RANDOM_TEST_STRING", aho)

    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.CourtPNCIdentifier).toStrictEqual(
      "RANDOM_TEST_STRING"
    )
  })
})

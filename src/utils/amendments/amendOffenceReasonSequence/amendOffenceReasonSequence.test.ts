import { describe, expect } from "@jest/globals"
import {
  AnnotatedHearingOutcome,
  Offence
} from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import createDummyAho from "../../../../test/helpers/createDummyAho"
import createDummyOffence from "../../../../test/helpers/createDummyOffence"
import amendOffenceReasonSequence from "./amendOffenceReasonSequence"

describe("amend offence reason sequence", () => {
  let aho: AnnotatedHearingOutcome
  let dummyOffence: Offence

  beforeEach(() => {
    aho = createDummyAho() as AnnotatedHearingOutcome
    dummyOffence = createDummyOffence() as Offence
  })

  it("amends offence reason sequence to aho", () => {
    const offenceIndex = 3

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      dummyOffence,
      dummyOffence,
      dummyOffence,
      dummyOffence
    ]

    amendOffenceReasonSequence(
      {
        offenceIndex,
        updatedValue: "newOffenceReasonSequenceValue"
      },
      aho
    )
    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex]
        .CriminalProsecutionReference.OffenceReasonSequence
    ).toEqual("newOffenceReasonSequenceValue")
    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].ManualSequenceNumber
    ).toBe(true)
  })
})

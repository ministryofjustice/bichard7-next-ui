import {
  AnnotatedHearingOutcome,
  Offence
} from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import cloneDeep from "lodash.clonedeep"
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
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]

    amendOffenceReasonSequence(
      [
        {
          offenceIndex,
          updatedValue: "newOffenceReasonSequenceValue"
        }
      ],
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

  it("should amend offence reason on multiple offences", () => {
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]

    const amendments = [
      {
        offenceIndex: 0,
        updatedValue: "firstOffenceReasonSequenceValue"
      },
      {
        offenceIndex: 1,
        updatedValue: "secondOffenceReasonSequenceValue"
      },
      {
        offenceIndex: 2,
        updatedValue: "thirdOffenceReasonSequenceValue"
      }
    ]

    amendOffenceReasonSequence(amendments, aho)

    amendments.forEach(({ updatedValue, offenceIndex }) => {
      expect(
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex]
          .CriminalProsecutionReference.OffenceReasonSequence
      ).toEqual(updatedValue)
      expect(
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].ManualSequenceNumber
      ).toBe(true)
    })
  })
})

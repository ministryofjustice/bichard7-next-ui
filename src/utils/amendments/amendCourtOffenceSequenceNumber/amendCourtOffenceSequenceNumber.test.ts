import {
  AnnotatedHearingOutcome,
  Offence
} from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import createDummyAho from "../../../../test/helpers/createDummyAho"
import createDummyOffence from "../../../../test/helpers/createDummyOffence"
import amendCourtOffenceSequenceNumber from "./amendCourtOffenceSequenceNumber"

describe("court offence sequence number", () => {
  let aho: AnnotatedHearingOutcome
  let dummyOffence: Offence

  beforeEach(() => {
    aho = createDummyAho() as AnnotatedHearingOutcome
    dummyOffence = createDummyOffence() as Offence
  })

  it("amend a court offence sequence number", () => {
    const offenceIndex = 3

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      dummyOffence,
      dummyOffence,
      dummyOffence,
      dummyOffence
    ]

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[0].CourtOffenceSequenceNumber
    ).toBe(undefined)

    amendCourtOffenceSequenceNumber(
      {
        offenceIndex,
        updatedValue: 1111
      },
      aho
    )

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[0].CourtOffenceSequenceNumber
    ).toEqual(1111)
  })

  it("return an error if offence index is out of range", () => {
    expect(() =>
      amendCourtOffenceSequenceNumber(
        {
          offenceIndex: 1,
          updatedValue: 1111
        },
        aho
      )
    ).toThrowError("Cannot update the CourtOffenceSequenceNumber; Offence index is out of range")
  })
})

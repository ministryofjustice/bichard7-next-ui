import {
  AnnotatedHearingOutcome,
  Offence
} from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import cloneDeep from "lodash.clonedeep"
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
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex].CourtOffenceSequenceNumber
    ).toBe(undefined)

    amendCourtOffenceSequenceNumber(
      [
        {
          offenceIndex,
          updatedValue: 1111
        }
      ],
      aho
    )

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex].CourtOffenceSequenceNumber
    ).toEqual(1111)
  })

  it("throw an error if offence index is out of range", () => {
    expect(() =>
      amendCourtOffenceSequenceNumber(
        [
          {
            offenceIndex: 1,
            updatedValue: 1111
          }
        ],
        aho
      )
    ).toThrowError("Cannot update the CourtOffenceSequenceNumber; Offence index is out of range")
  })

  it("amend a court offence sequence number on multiple offences", () => {
    const amendments = [
      {
        offenceIndex: 3,
        updatedValue: 3333
      },
      {
        offenceIndex: 0,
        updatedValue: 1111
      }
    ]

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]

    amendments.forEach(({ offenceIndex }) => {
      expect(
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex]
          .CourtOffenceSequenceNumber
      ).toBe(undefined)
    })

    amendCourtOffenceSequenceNumber(amendments, aho)

    amendments.forEach(({ offenceIndex, updatedValue }) => {
      expect(
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex]
          .CourtOffenceSequenceNumber
      ).toEqual(updatedValue)
    })
  })
})

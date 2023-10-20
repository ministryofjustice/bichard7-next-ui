import {
  AnnotatedHearingOutcome,
  Offence
} from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import cloneDeep from "lodash.clonedeep"
import createDummyAho from "../../../../test/helpers/createDummyAho"
import createDummyOffence from "../../../../test/helpers/createDummyOffence"
import amendCourtCaseReference from "./amendCourtCaseReference"

describe("court case reference", () => {
  let aho: AnnotatedHearingOutcome
  let dummyOffence: Offence

  beforeEach(() => {
    aho = createDummyAho() as AnnotatedHearingOutcome
    dummyOffence = createDummyOffence() as Offence
  })

  it("amends court case reference", () => {
    const offenceIndex = 3
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]

    amendCourtCaseReference(
      [
        {
          offenceIndex,
          updatedValue: "newCourtCaseReference"
        }
      ],
      aho
    )

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].CourtCaseReferenceNumber
    ).toEqual("newCourtCaseReference")
    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].ManualCourtCaseReference
    ).toBe(true)
  })

  it("Should set court case reference to null if there is no value", () => {
    amendCourtCaseReference(
      [
        {
          offenceIndex: 0,
          updatedValue: ""
        }
      ],
      aho
    )

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].CourtCaseReferenceNumber
    ).toEqual(null)
  })

  it("Should amend court case reference on multiple offences", () => {
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]

    const amendments = [
      {
        offenceIndex: 3,
        updatedValue: "newCourtCaseReference3"
      },
      {
        offenceIndex: 2,
        updatedValue: "newCourtCaseReference2"
      },
      {
        offenceIndex: 0,
        updatedValue: "newCourtCaseReference0"
      }
    ]

    amendCourtCaseReference(amendments, aho)

    amendments.forEach(({ updatedValue, offenceIndex }) => {
      expect(
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].CourtCaseReferenceNumber
      ).toEqual(updatedValue)
      expect(
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].ManualCourtCaseReference
      ).toBe(true)
    })
  })
})

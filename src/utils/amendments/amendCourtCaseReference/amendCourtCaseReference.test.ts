import { describe, expect } from "@jest/globals"
import {
  AnnotatedHearingOutcome,
  Offence
} from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
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
      dummyOffence,
      dummyOffence,
      dummyOffence,
      dummyOffence
    ]

    amendCourtCaseReference(
      {
        offenceIndex,
        updatedValue: "newCourtCaseReference"
      },
      aho
    )

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].CourtCaseReferenceNumber
    ).toEqual("newCourtCaseReference")
    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].ManualCourtCaseReference
    ).toBe(true)
  })

  it("should set court case reference to null if there is no value", () => {
    amendCourtCaseReference(
      {
        offenceIndex: 0,
        updatedValue: ""
      },
      aho
    )

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].CourtCaseReferenceNumber
    ).toEqual(null)
  })
})

import { describe, expect } from "@jest/globals"
import {
  AnnotatedHearingOutcome,
  Offence
} from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import createDummyAho from "../../../../test/helpers/createDummyAho"
import createDummyOffence from "../../../../test/helpers/createDummyOffence"
import amendNextHearingDate from "./amendNextHearingDate"

describe("amend fresult variable text", () => {
  let aho: AnnotatedHearingOutcome
  let dummyOffence: Offence

  beforeEach(() => {
    aho = createDummyAho() as AnnotatedHearingOutcome
    dummyOffence = createDummyOffence() as Offence
  })
  it("amend valid next hearing date to defendant result", () => {
    const offenceIndex = -1
    const updatedValue = new Date(2022, 8, 24)
    const resultIndex = 0

    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Result?.NextHearingDate).toBe(undefined)

    amendNextHearingDate({ offenceIndex, updatedValue, resultIndex }, aho)

    const actualNextHearingDate =
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Result?.NextHearingDate

    expect(actualNextHearingDate).toEqual(updatedValue)
  })

  it("amend valid next hearing date to offender result", () => {
    const offenceIndex = 0
    const updatedValue = new Date(2022, 8, 24)
    const resultIndex = 0

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      dummyOffence,
      dummyOffence,
      dummyOffence,
      dummyOffence
    ]

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex].Result[resultIndex]
        .NextHearingDate
    ).toBe(undefined)

    amendNextHearingDate({ offenceIndex, updatedValue, resultIndex }, aho)

    const actualNextHearingDate =
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex].Result[resultIndex]
        .NextHearingDate

    expect(actualNextHearingDate).toEqual(updatedValue)
  })

  it("returns an error as defendant Result is undefined", () => {
    const offenceIndex = -1
    const updatedValue = new Date(2022, 8, 24)
    const resultIndex = 0

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result = undefined

    expect(() =>
      amendNextHearingDate(
        {
          offenceIndex,
          updatedValue,
          resultIndex
        },
        aho
      )
    ).toThrowError("Cannot update the NextHearingDate; Result in undefined")
  })

  it("returns an error if result is out of range", () => {
    const offenceIndex = 0
    const updatedValue = new Date(2022, 8, 24)
    const resultIndex = 1

    expect(() =>
      amendNextHearingDate(
        {
          offenceIndex,
          updatedValue,
          resultIndex
        },
        aho
      )
    ).toThrowError("Cannot update NextHearingDate; Result index on Offence is out of range")
  })

  it("returns an error if offence is out of range", () => {
    const offenceIndex = 1
    const updatedValue = new Date(2022, 8, 24)
    const resultIndex = 0

    expect(() =>
      amendNextHearingDate(
        {
          offenceIndex,
          updatedValue,
          resultIndex
        },
        aho
      )
    ).toThrowError("Cannot update the NextHearingDate; Offence index is out of range")
  })
})

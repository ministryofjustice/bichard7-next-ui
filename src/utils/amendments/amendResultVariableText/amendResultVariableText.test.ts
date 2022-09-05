import {
  AnnotatedHearingOutcome,
  Offence
} from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import createDummyAho from "../../../../test/helpers/createDummyAho"
import createDummyOffence from "../../../../test/helpers/createDummyOffence"
import amendResultVariableText from "./amendResultVariableText"

describe("amend fresult variable text", () => {
  let aho: AnnotatedHearingOutcome
  let dummyOffence: Offence

  beforeEach(() => {
    aho = createDummyAho() as AnnotatedHearingOutcome
    dummyOffence = createDummyOffence() as Offence
  })

  it("amend valid result variable text to defendant result", () => {
    const offenceIndex = -1
    const updatedValue = "random_string"
    const resultIndex = 0

    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Result?.ResultVariableText).toBe(undefined)

    amendResultVariableText(
      {
        offenceIndex,
        updatedValue,
        resultIndex
      },
      aho
    )

    const actualResultVariableText =
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Result?.ResultVariableText

    expect(actualResultVariableText).toEqual(updatedValue)
  })

  it("amend valid result variable text to offender result", () => {
    const offenceIndex = 0
    const updatedValue = "random_string"
    const resultIndex = 0

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      dummyOffence,
      dummyOffence,
      dummyOffence,
      dummyOffence
    ]

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex]?.Result[resultIndex]
        .ResultVariableText
    ).toBe(undefined)

    amendResultVariableText(
      {
        offenceIndex,
        updatedValue,
        resultIndex
      },
      aho
    )

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex]?.Result[resultIndex]
        .ResultVariableText
    ).toEqual(updatedValue)
  })

  it("returns an error as defendant Result is undefined", () => {
    const offenceIndex = -1
    const updatedValue = "random_string"
    const resultIndex = 0

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result = undefined

    expect(() =>
      amendResultVariableText(
        {
          offenceIndex,
          updatedValue,
          resultIndex
        },
        aho
      )
    ).toThrowError("Cannot update the ResultVariableText; Result in undefined")
  })

  it("returns an error if result is out of range", () => {
    const offenceIndex = 0
    const updatedValue = "random_string"
    const resultIndex = 1

    expect(() =>
      amendResultVariableText(
        {
          offenceIndex,
          updatedValue,
          resultIndex
        },
        aho
      )
    ).toThrowError("Cannot update ResultVariableText; Result index on Offence is out of range")
  })

  it("returns an error if offence is out of range", () => {
    const offenceIndex = 1
    const updatedValue = "random_string"
    const resultIndex = 0

    expect(() =>
      amendResultVariableText(
        {
          offenceIndex,
          updatedValue,
          resultIndex
        },
        aho
      )
    ).toThrowError("Cannot update the ResultVariableText; Offence index is out of range")
  })
})

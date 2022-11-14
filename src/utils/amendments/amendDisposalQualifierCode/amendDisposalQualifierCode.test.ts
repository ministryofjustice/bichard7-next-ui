import {
  AnnotatedHearingOutcome,
  Offence
} from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import cloneDeep from "lodash.clonedeep"
import { UpdatedDisposalQualifierCode } from "types/Amendments"
import createDummyAho from "../../../../test/helpers/createDummyAho"
import createDummyOffence from "../../../../test/helpers/createDummyOffence"
import amendDisposalQualifierCode from "./amendDisposalQualifierCode"

describe("disposal qualifier code", () => {
  let aho: AnnotatedHearingOutcome
  let dummyOffence: Offence

  beforeEach(() => {
    aho = createDummyAho() as AnnotatedHearingOutcome
    dummyOffence = createDummyOffence() as Offence
  })

  it("amends result qualifier variable code to defendant", () => {
    const updatedValue = "newQualifierCode"
    const offenceIndex = -1
    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Result?.ResultQualifierVariable[0].Code
    ).not.toBe("newQualifierCode")

    amendDisposalQualifierCode(
      [
        {
          offenceIndex,
          updatedValue,
          resultQualifierIndex: 0
        }
      ],
      aho
    )

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Result?.ResultQualifierVariable[0].Code
    ).toBe("newQualifierCode")
  })

  it("amends result qualifier variable code to offence", () => {
    const updatedValue = "newQualifierCode"
    const offenceIndex = 0
    const resultIndex = 0
    const resultQualifierIndex = 0

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex].Result[resultIndex]
        .ResultQualifierVariable[resultQualifierIndex].Code
    ).not.toBe(0)

    amendDisposalQualifierCode([{ offenceIndex, updatedValue, resultQualifierIndex, resultIndex }], aho)

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex].Result[resultIndex]
        .ResultQualifierVariable[resultQualifierIndex].Code
    ).toBe(updatedValue)
  })

  it("creates result qualifier variable code on offence, if it doesn't already exist", () => {
    const updatedValue = "newQualifierCode"
    const offenceIndex = 0
    const resultIndex = 0
    const resultQualifierIndex = 4

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex].Result[resultIndex]
        .ResultQualifierVariable[resultQualifierIndex]
    ).toBe(undefined)

    amendDisposalQualifierCode(
      [
        {
          offenceIndex,
          updatedValue,
          resultQualifierIndex,
          resultIndex
        }
      ],
      aho
    )

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex].Result[resultIndex]
        .ResultQualifierVariable[1].Code
    ).toBe(updatedValue)
  })

  it("creates result qualifier variable code on defendant, if it doesn't already exist", () => {
    const updatedValue = "newQualifierCode"
    const offenceIndex = -1
    const resultQualifierIndex = 4

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Result?.ResultQualifierVariable[
        resultQualifierIndex
      ]
    ).toBe(undefined)

    amendDisposalQualifierCode(
      [
        {
          offenceIndex,
          updatedValue,
          resultQualifierIndex
        }
      ],
      aho
    )

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Result?.ResultQualifierVariable[1].Code
    ).toBe(updatedValue)
  })

  it("throws an error if there is no Result key on HearingDefendant", () => {
    const updatedValue = "newQualifierCode"
    const offenceIndex = -1
    const resultQualifierIndex = 4

    delete aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result

    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Result).toBe(undefined)

    expect(() =>
      amendDisposalQualifierCode(
        [
          {
            offenceIndex,
            updatedValue,
            resultQualifierIndex
          }
        ],
        aho
      )
    ).toThrowError("Cannot update the ResultQualifierVariable; Result in undefined")
  })

  it("throw error if there is no ResultIndex key is passing to an offence update", () => {
    const updatedValue = "newQualifierCode"
    const offenceIndex = 0
    const resultQualifierIndex = 4

    expect(() =>
      amendDisposalQualifierCode(
        [
          {
            offenceIndex,
            updatedValue,
            resultQualifierIndex
          }
        ],
        aho
      )
    ).toThrowError("Cannot update the ResultQualifierVariable; ResultIndex is undefined")
  })

  it("throw error if the offence index is out of the range of the Offence array", () => {
    const updatedValue = "newQualifierCode"
    const offenceIndex = 9

    expect(() =>
      amendDisposalQualifierCode(
        [
          {
            offenceIndex,
            updatedValue,
            resultQualifierIndex: 4
          }
        ],
        aho
      )
    ).toThrowError("Cannot update the ResultQualifierVariable; offence index is out of range")
  })

  it("amends result qualifier variable code to multiple offences", () => {
    const amendments: UpdatedDisposalQualifierCode[] = [
      {
        offenceIndex: 0,
        resultIndex: 0,
        updatedValue: "new0",
        resultQualifierIndex: 0
      },
      {
        offenceIndex: 2,
        resultIndex: 0,
        updatedValue: "new1",
        resultQualifierIndex: 0
      },
      {
        offenceIndex: 3,
        resultIndex: 0,
        updatedValue: "new2",
        resultQualifierIndex: 0
      }
    ]

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]

    amendments.forEach(({ offenceIndex, resultIndex, resultQualifierIndex }) => {
      expect(
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex].Result[resultIndex || 0]
          .ResultQualifierVariable[resultQualifierIndex].Code
      ).not.toBe(0)
    })

    amendDisposalQualifierCode(amendments, aho)

    amendments.forEach(({ offenceIndex, resultIndex, resultQualifierIndex, updatedValue }) => {
      expect(
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex].Result[resultIndex || 0]
          .ResultQualifierVariable[resultQualifierIndex].Code
      ).toBe(updatedValue)
    })
  })

  it("amends result qualifier variable code on multiple results in an offence", () => {
    const amendments: UpdatedDisposalQualifierCode[] = [
      {
        offenceIndex: 0,
        resultIndex: 0,
        updatedValue: "new0",
        resultQualifierIndex: 0
      },
      {
        offenceIndex: 0,
        resultIndex: 1,
        updatedValue: "new1",
        resultQualifierIndex: 0
      }
    ]

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence),
      cloneDeep(dummyOffence)
    ]

    amendments.forEach(({ offenceIndex, resultIndex, resultQualifierIndex }) => {
      expect(
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex].Result[resultIndex || 0]
          .ResultQualifierVariable[resultQualifierIndex].Code
      ).not.toBe(0)
    })

    amendDisposalQualifierCode(amendments, aho)

    amendments.forEach(({ offenceIndex, resultIndex, resultQualifierIndex, updatedValue }) => {
      expect(
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex].Result[resultIndex || 0]
          .ResultQualifierVariable[resultQualifierIndex].Code
      ).toBe(updatedValue)
    })
  })
})

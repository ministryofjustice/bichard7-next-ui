import { describe, expect } from "@jest/globals"
import {
  AnnotatedHearingOutcome,
  Offence
} from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import createDummyAho from "../../../../test/helpers/createDummyAho"
import createDummyOffence from "../../../../test/helpers/createDummyOffence"
import amendNextReasonSourceOrganisation from "./amendNextResultSourceOrganisation"

describe("amend next result source organisation", () => {
  let aho: AnnotatedHearingOutcome
  let dummyOffence: Offence

  beforeEach(() => {
    aho = createDummyAho() as AnnotatedHearingOutcome
    dummyOffence = createDummyOffence() as Offence
  })

  it("sets on defendant the next result source organisation", () => {
    const offenceIndex = -1
    const resultIndex = 0
    const updatedValue = "RANDOM_TEST_STRING"

    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Result?.NextResultSourceOrganisation).toBe(
      undefined
    )

    amendNextReasonSourceOrganisation({ offenceIndex, resultIndex, updatedValue }, aho)

    const actualOrganisationUnitCode =
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Result?.NextResultSourceOrganisation

    expect(actualOrganisationUnitCode?.OrganisationUnitCode).toBe(updatedValue)
    expect(actualOrganisationUnitCode?.TopLevelCode).toBe(updatedValue.substring(0, 1))
    expect(actualOrganisationUnitCode?.SecondLevelCode).toBe(updatedValue.substring(1, 3))
    expect(actualOrganisationUnitCode?.ThirdLevelCode).toBe(updatedValue.substring(3, 5))
    expect(actualOrganisationUnitCode?.BottomLevelCode).toBe(updatedValue.substring(5, 6))
  })
  it("sets the ou codes as null (no TopLevelCode property) when the incoming value length is 0", () => {
    const offenceIndex = -1
    const resultIndex = 0
    const updatedValue = ""

    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Result?.NextResultSourceOrganisation).toBe(
      undefined
    )

    amendNextReasonSourceOrganisation({ offenceIndex, resultIndex, updatedValue }, aho)

    const actualOrganisationUnitCode =
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Result?.NextResultSourceOrganisation

    expect(actualOrganisationUnitCode?.OrganisationUnitCode).toBe(updatedValue)
    expect(actualOrganisationUnitCode?.TopLevelCode).toBe(undefined)
    expect(actualOrganisationUnitCode?.SecondLevelCode).toBe(null)
    expect(actualOrganisationUnitCode?.ThirdLevelCode).toBe(null)
    expect(actualOrganisationUnitCode?.BottomLevelCode).toBe(null)
  })

  it("sets on offence the next result source organisation", () => {
    const offenceIndex = 2
    const resultIndex = 0
    const updatedValue = "RANDOM_TEST_STRING"

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      dummyOffence,
      dummyOffence,
      dummyOffence,
      dummyOffence
    ]

    expect(
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex]?.Result[resultIndex]
        .NextResultSourceOrganisation
    ).toBe(undefined)

    amendNextReasonSourceOrganisation({ offenceIndex, resultIndex, updatedValue }, aho)

    const actualOrganisationUnitCode =
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant?.Offence[offenceIndex]?.Result[resultIndex]
        ?.NextResultSourceOrganisation

    expect(actualOrganisationUnitCode?.OrganisationUnitCode).toBe(updatedValue)
    expect(actualOrganisationUnitCode?.TopLevelCode).toBe(updatedValue.substring(0, 1))
    expect(actualOrganisationUnitCode?.SecondLevelCode).toBe(updatedValue.substring(1, 3))
    expect(actualOrganisationUnitCode?.ThirdLevelCode).toBe(updatedValue.substring(3, 5))
    expect(actualOrganisationUnitCode?.BottomLevelCode).toBe(updatedValue.substring(5, 6))
  })
  it("returns an error if the defendant result is undefined", () => {
    const offenceIndex = -1
    const resultIndex = 0
    const updatedValue = "RANDOM_TEST_STRING"

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result = undefined

    expect(() => amendNextReasonSourceOrganisation({ offenceIndex, resultIndex, updatedValue }, aho)).toThrowError(
      "Cannot update the NextResultSourceOrganisation; Result in undefined"
    )
  })

  it("returns an error if the offence index is out of range", () => {
    const offenceIndex = 6
    const resultIndex = 0
    const updatedValue = "RANDOM_TEST_STRING"

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      dummyOffence,
      dummyOffence,
      dummyOffence,
      dummyOffence
    ]
    expect(() => amendNextReasonSourceOrganisation({ offenceIndex, resultIndex, updatedValue }, aho)).toThrowError(
      `Cannot update the NextResultSourceOrganisation; Offence index is out of range`
    )
  })

  it("returns an error if the result index is out of range", () => {
    const offenceIndex = 0
    const resultIndex = 4
    const updatedValue = "RANDOM_TEST_STRING"

    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      dummyOffence,
      dummyOffence,
      dummyOffence,
      dummyOffence
    ]
    expect(() => amendNextReasonSourceOrganisation({ offenceIndex, resultIndex, updatedValue }, aho)).toThrowError(
      `Cannot update NextResultSourceOrganisation; Result index on Offence is out of range`
    )
  })
})

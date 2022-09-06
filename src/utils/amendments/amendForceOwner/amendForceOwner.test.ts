import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import createDummyAho from "../../../../test/helpers/createDummyAho"
import amendForceOwner from "./amendForceOwner"

describe("amend force owner", () => {
  let aho: AnnotatedHearingOutcome
  let testString: string

  beforeEach(() => {
    aho = createDummyAho() as AnnotatedHearingOutcome
    testString = "RANDOM_FORCE_OWNER_TEST_STRING"
  })

  it("amend force owner when force owner property exist", () => {
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner = {
      SecondLevelCode: null,
      ThirdLevelCode: null,
      BottomLevelCode: null,
      OrganisationUnitCode: "original_value"
    }

    amendForceOwner(testString, aho)

    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner?.OrganisationUnitCode).toEqual(
      `${testString.substring(0, 2)}YZ00`
    )
  })

  it("amend force owner when force owner property doesn't exist", () => {
    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner).toBe(undefined)

    amendForceOwner(testString, aho)

    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner?.OrganisationUnitCode).toEqual(
      `${testString.substring(0, 2)}YZ00`
    )
  })

  it("set manual force owner to true when the property doesn't already exist", () => {
    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.ManualForceOwner).toBe(undefined)

    amendForceOwner(testString, aho)

    expect(aho.AnnotatedHearingOutcome.HearingOutcome.Case.ManualForceOwner).toBe(true)
  })
})

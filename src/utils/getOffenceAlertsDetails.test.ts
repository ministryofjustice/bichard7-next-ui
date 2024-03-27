import { Amendments } from "types/Amendments"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import { nextHearingDateExceptionResolvedFn, nextHearingLocationExceptionResolvedFn } from "./getOffenceAlertsDetails"

const nextHearingDateException = {
  code: ExceptionCode.HO100102,
  path: [
    "AnnotatedHearingOutcome",
    "HearingOutcome",
    "Case",
    "HearingDefendant",
    "Offence",
    0,
    "Result",
    0,
    "NextHearingDate"
  ]
}

const nextHearingLocationException = {
  code: ExceptionCode.HO100322,
  path: [
    "AnnotatedHearingOutcome",
    "HearingOutcome",
    "Case",
    "HearingDefendant",
    "Offence",
    1,
    "Result",
    0,
    "NextResultSourceOrganisation",
    "OrganisationUnitCode"
  ]
}

describe("nextHearingDateExceptionResolvedFn", () => {
  it("Should return true when relevant exception is resolved", () => {
    const updatedFields = {
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          value: "2024-03-30"
        }
      ]
    } as Amendments

    const nextHearingDateExceptionResolved = nextHearingDateExceptionResolvedFn(
      updatedFields,
      nextHearingDateException,
      0
    )

    expect(nextHearingDateExceptionResolved).toBe(true)
  })

  it("Should return false when exception is not resolved", () => {
    const updatedFields = {} as Amendments

    const nextHearingDateExceptionResolved = nextHearingDateExceptionResolvedFn(
      updatedFields,
      nextHearingDateException,
      0
    )

    expect(nextHearingDateExceptionResolved).toBe(false)
  })

  it("Should return false when irrelevant exception is resolved", () => {
    const updatedFields = {
      nextSourceOrganisation: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          value: "B21XA00"
        }
      ]
    } as Amendments

    const nextHearingDateExceptionResolved = nextHearingDateExceptionResolvedFn(
      updatedFields,
      nextHearingDateException,
      0
    )

    expect(nextHearingDateExceptionResolved).toBe(false)
  })

  it("Should return false when exception is resolved in different offence", () => {
    const updatedFields = {
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 1,
          value: "2024-03-30"
        }
      ]
    } as Amendments

    const nextHearingDateExceptionResolved = nextHearingDateExceptionResolvedFn(
      updatedFields,
      nextHearingLocationException,
      0
    )

    expect(nextHearingDateExceptionResolved).toBe(false)
  })

  it("Should return false when currepted data is found in updatedFields", () => {
    const updatedFields = {
      nextHearingDate: undefined
    } as unknown as Amendments

    const nextHearingDateExceptionResolved = nextHearingDateExceptionResolvedFn(
      updatedFields,
      nextHearingDateException,
      0
    )

    expect(nextHearingDateExceptionResolved).toBe(false)
  })

  it("Should return false when currepted offenceIndex is found in updatedFields", () => {
    const updatedFields = {
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: undefined,
          value: "2024-03-30"
        }
      ]
    } as unknown as Amendments

    const nextHearingDateExceptionResolved = nextHearingDateExceptionResolvedFn(
      updatedFields,
      nextHearingDateException,
      0
    )

    expect(nextHearingDateExceptionResolved).toBe(false)
  })
})

describe("nextHearingLocationExceptionResolvedFn", () => {
  it("Should return true when relevant exception is resolved", () => {
    const updatedFields = {
      nextSourceOrganisation: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          value: "B21XA00"
        }
      ]
    } as Amendments

    const nextHearingLocationResolved = nextHearingLocationExceptionResolvedFn(
      updatedFields,
      nextHearingLocationException,
      0
    )

    expect(nextHearingLocationResolved).toBe(true)
  })

  it("Should return false when exception is not resolved", () => {
    const updatedFields = {} as Amendments

    const nextHearingLocationResolved = nextHearingLocationExceptionResolvedFn(
      updatedFields,
      nextHearingLocationException,
      0
    )

    expect(nextHearingLocationResolved).toBe(false)
  })

  it("Should return false when irrelevant exception is resolved", () => {
    const updatedFields = {
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          value: "2024-03-30"
        }
      ]
    } as Amendments

    const nextHearingLocationResolved = nextHearingLocationExceptionResolvedFn(
      updatedFields,
      nextHearingDateException,
      0
    )

    expect(nextHearingLocationResolved).toBe(false)
  })

  it("Should return false when exception is resolved in different offence", () => {
    const exception = nextHearingLocationException
    const updatedFields = {
      nextSourceOrganisation: [
        {
          resultIndex: 0,
          offenceIndex: 1,
          value: "B21XA00"
        }
      ]
    } as Amendments

    const nextHearingDateExceptionResolved = nextHearingDateExceptionResolvedFn(updatedFields, exception, 0)

    expect(nextHearingDateExceptionResolved).toBe(false)
  })

  it("Should return false when currepted data is found in updatedFields", () => {
    const updatedFields = {
      nextSourceOrganisation: undefined
    } as unknown as Amendments

    const nextHearingLocationResolved = nextHearingLocationExceptionResolvedFn(
      updatedFields,
      nextHearingLocationException,
      0
    )

    expect(nextHearingLocationResolved).toBe(false)
  })

  it("Should return false when currepted offenceIndex is found in updatedFields", () => {
    const updatedFields = {
      nextSourceOrganisation: [
        {
          resultIndex: 0,
          offenceIndex: 1,
          value: "B21XA00"
        }
      ]
    } as Amendments

    const nextHearingDateExceptionResolved = nextHearingDateExceptionResolvedFn(
      updatedFields,
      nextHearingDateException,
      0
    )

    expect(nextHearingDateExceptionResolved).toBe(false)
  })
})

import { AmendmentRecords } from "types/Amendments"
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
          updatedValue: "2024-03-30"
        }
      ]
    } as AmendmentRecords

    const nextHearingDateExceptionResolved = nextHearingDateExceptionResolvedFn(
      updatedFields,
      nextHearingDateException,
      0
    )

    expect(nextHearingDateExceptionResolved).toBe(true)
  })

  it("Should return false when exception is not resolved", () => {
    const updatedFields = {} as AmendmentRecords

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
          updatedValue: "B21XA00"
        }
      ]
    } as AmendmentRecords

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
          updatedValue: "2024-03-30"
        }
      ]
    } as AmendmentRecords

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
    } as unknown as AmendmentRecords

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
          updatedValue: "2024-03-30"
        }
      ]
    } as unknown as AmendmentRecords

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
          updatedValue: "B21XA00"
        }
      ]
    } as AmendmentRecords

    const nextHearingLocationResolved = nextHearingLocationExceptionResolvedFn(
      updatedFields,
      nextHearingLocationException,
      0
    )

    expect(nextHearingLocationResolved).toBe(true)
  })

  it("Should return false when exception is not resolved", () => {
    const updatedFields = {} as AmendmentRecords

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
          updatedValue: "2024-03-30"
        }
      ]
    } as AmendmentRecords

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
          updatedValue: "B21XA00"
        }
      ]
    } as AmendmentRecords

    const nextHearingDateExceptionResolved = nextHearingDateExceptionResolvedFn(updatedFields, exception, 0)

    expect(nextHearingDateExceptionResolved).toBe(false)
  })

  it("Should return false when currepted data is found in updatedFields", () => {
    const updatedFields = {
      nextSourceOrganisation: undefined
    } as unknown as AmendmentRecords

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
          updatedValue: "B21XA00"
        }
      ]
    } as unknown as AmendmentRecords

    const nextHearingDateExceptionResolved = nextHearingDateExceptionResolvedFn(
      updatedFields,
      nextHearingDateException,
      0
    )

    expect(nextHearingDateExceptionResolved).toBe(false)
  })
})

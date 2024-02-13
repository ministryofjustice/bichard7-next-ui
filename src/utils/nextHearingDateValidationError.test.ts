import { DisplayFullCourtCase } from "../types/display/CourtCases"
import { AmendmentRecords } from "../types/Amendments"
import nextHearingDateValidationError from "./nextHearingDateValidationError"

describe("nextHearingDateValidationError", () => {
  const exceptionHO100102 = {
    code: "HO100102",
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

  const exceptionHO100323 = {
    code: "HO100323",
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

  const courtCase = {
    aho: {
      Exceptions: [exceptionHO100102]
    }
  } as unknown as DisplayFullCourtCase

  it("should return true if next hearing date editable field is empty", () => {
    const amendments = {
      asn: "1101ZD0100000448754K",
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          updatedValue: ""
        }
      ]
    } as unknown as AmendmentRecords
    const result = nextHearingDateValidationError(courtCase.aho.Exceptions, amendments)

    expect(result).toBe(true)
  })

  it("should return false if a value is entered into the next hearing date editable field", () => {
    const amendments = {
      asn: "1101ZD0100000448754K",
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          updatedValue: "2025-02-10"
        }
      ]
    } as unknown as AmendmentRecords

    const result = nextHearingDateValidationError(courtCase.aho.Exceptions, amendments)

    expect(result).toBe(false)
  })

  it("should return true if one of the next hearing location editable fields remained empty", () => {
    const courtCaseWithMultipleExceptions = {
      aho: {
        Exceptions: [exceptionHO100102, exceptionHO100323]
      }
    } as unknown as DisplayFullCourtCase

    const amendments = {
      asn: "1101ZD0100000448754K",
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          updatedValue: "2025-02-10"
        },
        {
          resultIndex: 0,
          offenceIndex: 1,
          updatedValue: ""
        }
      ]
    } as unknown as AmendmentRecords

    const result = nextHearingDateValidationError(courtCaseWithMultipleExceptions.aho.Exceptions, amendments)

    expect(result).toBe(true)
  })

  it("should return false if multiple hearing date editable fields have values", () => {
    const courtCaseWithMultipleExceptions = {
      aho: {
        Exceptions: [exceptionHO100102, exceptionHO100323]
      }
    } as unknown as DisplayFullCourtCase

    const amendments = {
      asn: "1101ZD0100000448754K",
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          updatedValue: "2025-01-10"
        },
        {
          resultIndex: 0,
          offenceIndex: 1,
          updatedValue: "2026-05-10"
        }
      ]
    } as unknown as AmendmentRecords

    const result = nextHearingDateValidationError(courtCaseWithMultipleExceptions.aho.Exceptions, amendments)

    expect(result).toBe(false)
  })
})

import { AmendmentRecords } from "types/Amendments"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import asnValidationError from "./asnValidationError"

describe("asnValidationError", () => {
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

  const exceptionHO100206 = {
    code: "HO100206",
    path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
  }

  const courtCase = {
    aho: {
      Exceptions: [exceptionHO100102]
    }
  } as unknown as DisplayFullCourtCase

  it("should return false when ASN editable field is empty and ASN exception is not raised", () => {
    const amendments = {
      asn: "",
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          updatedValue: "2025-02-10"
        }
      ]
    } as unknown as AmendmentRecords

    const result = asnValidationError(courtCase.aho.Exceptions, amendments)

    expect(result).toBe(false)
  })

  it("should return true when ASN editable field is empty and ASN exception is raised", () => {
    const courtCaseWithAsnException = {
      aho: {
        Exceptions: [exceptionHO100206]
      }
    } as unknown as DisplayFullCourtCase
    const amendments = {
      asn: "",
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          updatedValue: "2025-02-10"
        }
      ]
    } as unknown as AmendmentRecords

    const result = asnValidationError(courtCaseWithAsnException.aho.Exceptions, amendments)

    expect(result).toBe(true)
  })

  it("should return true if asn editable field has an invalid value entered", () => {
    const amendments = {
      asn: "ABCDEF123456K",
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          updatedValue: "2025-02-10"
        }
      ]
    } as unknown as AmendmentRecords

    const result = asnValidationError(courtCase.aho.Exceptions, amendments)

    expect(result).toBe(true)
  })

  it("should return false if a valid value is entered into the asn editable field", () => {
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

    const result = asnValidationError(courtCase.aho.Exceptions, amendments)

    expect(result).toBe(false)
  })
})

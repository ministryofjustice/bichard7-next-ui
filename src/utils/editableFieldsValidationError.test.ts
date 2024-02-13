import { DisplayFullCourtCase } from "types/display/CourtCases"
import editableFieldsValidationError from "./editableFieldsValidationError"

describe("EditableFieldsValidationError", () => {
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

  const exceptionHO100300 = {
    code: "HO100300",
    path: [
      "AnnotatedHearingOutcome",
      "HearingOutcome",
      "Case",
      "HearingDefendant",
      "Offence",
      2,
      "Result",
      1,
      "NextResultSourceOrganisation",
      "OrganisationUnitCode"
    ]
  }

  const exceptionHO100206 = {
    code: "HO100206",
    path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
  }

  it.each([
    ["1101ZD0100000448754K", "B21XA00", "2025-02-10", false],
    ["", "B21XA00", "2025-02-10", false],
    ["1101ZD0100000448754K", "", "2025-02-10", true],
    ["1101ZD0100000448754K", "B21XA00", "", true],
    ["", "", "2025-02-10", true],
    ["", "B21XA00", "", true],
    ["1101ZD0100000448754K", "", "", true],
    ["", "", "", true]
  ])(
    "should return validation error according to value entered into editable fields",
    (asn: string, nextHearingLocationUpdatedValue: string, nextHearingDateUpdatedValue: string, hasError: boolean) => {
      const courtCase = {
        aho: {
          Exceptions: [exceptionHO100102, exceptionHO100300]
        }
      } as unknown as DisplayFullCourtCase

      const amendments = {
        asn: asn,
        nextSourceOrganisation: [
          {
            resultIndex: 0,
            offenceIndex: 1,
            updatedValue: nextHearingLocationUpdatedValue
          }
        ],
        nextHearingDate: [
          {
            resultIndex: 0,
            offenceIndex: 0,
            updatedValue: nextHearingDateUpdatedValue
          }
        ]
      }

      const result = editableFieldsValidationError(courtCase, amendments)

      expect(result).toBe(hasError)
    }
  )

  it("Should return true when ASN exception and Next-hearing-date exceptions are raised and both editable fields are empty", () => {
    const courtCase = {
      aho: {
        Exceptions: [exceptionHO100206, exceptionHO100102]
      }
    } as unknown as DisplayFullCourtCase

    const amendments = {
      asn: "",
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          updatedValue: ""
        }
      ]
    }

    const result = editableFieldsValidationError(courtCase, amendments)

    expect(result).toBe(true)
  })

  it("Should return false when Next-hearing-date exception is raised and asn editable fields is empty", () => {
    const courtCase = {
      aho: {
        Exceptions: [exceptionHO100102]
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
    }

    const result = editableFieldsValidationError(courtCase, amendments)

    expect(result).toBe(false)
  })

  it("Should return false when Next-hearing-location exception is raised and asn editable fields is empty", () => {
    const courtCase = {
      aho: {
        Exceptions: [exceptionHO100300]
      }
    } as unknown as DisplayFullCourtCase

    const amendments = {
      asn: "",
      nextSourceOrganisation: [
        {
          resultIndex: 0,
          offenceIndex: 1,
          updatedValue: "B01EF01"
        }
      ]
    }

    const result = editableFieldsValidationError(courtCase, amendments)

    expect(result).toBe(false)
  })
})

import { DisplayFullCourtCase } from "types/display/CourtCases"
import editableFieldsValidationError from "./editableFieldsValidationError"
import { AmendmentRecords } from "types/Amendments"

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

  const exceptionHO100322 = {
    code: "HO100322",
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

  describe("asnValidationError", () => {
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

      const result = editableFieldsValidationError(courtCase, amendments)

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

      const result = editableFieldsValidationError(courtCaseWithAsnException, amendments)

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

      const result = editableFieldsValidationError(courtCase, amendments)

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

      const result = editableFieldsValidationError(courtCase, amendments)

      expect(result).toBe(false)
    })
  })

  describe("nextHearingLocationValidationError", () => {
    const courtCase = {
      aho: {
        Exceptions: [exceptionHO100300]
      }
    } as unknown as DisplayFullCourtCase

    it("should return true if next hearing location editable field is empty", () => {
      const amendments = {
        asn: "1101ZD0100000448754K",
        nextSourceOrganisation: [
          {
            resultIndex: 0,
            offenceIndex: 1,
            updatedValue: ""
          }
        ]
      } as unknown as AmendmentRecords
      const result = editableFieldsValidationError(courtCase, amendments)

      expect(result).toBe(true)
    })

    it("should return false if a value is entered into the next hearing date editable field", () => {
      const amendments = {
        asn: "1101ZD0100000448754K",
        nextSourceOrganisation: [
          {
            resultIndex: 0,
            offenceIndex: 1,
            updatedValue: "B21XA00"
          }
        ]
      } as unknown as AmendmentRecords
      const result = editableFieldsValidationError(courtCase, amendments)

      expect(result).toBe(false)
    })

    it("should return true if one of the next hearing location editable fields remained empty", () => {
      const courtCaseWithMultipleExceptions = {
        aho: {
          Exceptions: [exceptionHO100300, exceptionHO100322]
        }
      } as unknown as DisplayFullCourtCase

      const amendments = {
        asn: "1101ZD0100000448754K",
        nextSourceOrganisation: [
          {
            resultIndex: 0,
            offenceIndex: 1,
            updatedValue: "B21XA00"
          },
          {
            resultIndex: 0,
            offenceIndex: 1,
            updatedValue: ""
          }
        ]
      } as unknown as AmendmentRecords
      const result = editableFieldsValidationError(courtCaseWithMultipleExceptions, amendments)

      expect(result).toBe(true)
    })

    it("should return false if multiple hearing location editable fields have values", () => {
      const courtCaseWithMultipleExceptions = {
        aho: {
          Exceptions: [exceptionHO100300, exceptionHO100322]
        }
      } as unknown as DisplayFullCourtCase

      const amendments = {
        asn: "1101ZD0100000448754K",
        nextSourceOrganisation: [
          {
            resultIndex: 0,
            offenceIndex: 1,
            updatedValue: "B21XA00"
          },
          {
            resultIndex: 0,
            offenceIndex: 1,
            updatedValue: "B21XA11"
          }
        ]
      } as unknown as AmendmentRecords
      const result = editableFieldsValidationError(courtCaseWithMultipleExceptions, amendments)

      expect(result).toBe(false)
    })
  })

  describe("nextHearingDateValidationError", () => {
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
      const result = editableFieldsValidationError(courtCase, amendments)

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

      const result = editableFieldsValidationError(courtCase, amendments)

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

      const result = editableFieldsValidationError(courtCaseWithMultipleExceptions, amendments)

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

      const result = editableFieldsValidationError(courtCaseWithMultipleExceptions, amendments)

      expect(result).toBe(false)
    })
  })
})

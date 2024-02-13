import { DisplayFullCourtCase } from "../types/display/CourtCases"
import { AmendmentRecords } from "../types/Amendments"
import nextHearingLocationValidationError from "./nextHearingLocationValidationError"

describe("nextHearingLocationValidationError", () => {
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
    const result = nextHearingLocationValidationError(courtCase.aho.Exceptions, amendments)

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
    const result = nextHearingLocationValidationError(courtCase.aho.Exceptions, amendments)

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
    const result = nextHearingLocationValidationError(courtCaseWithMultipleExceptions.aho.Exceptions, amendments)

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
    const result = nextHearingLocationValidationError(courtCaseWithMultipleExceptions.aho.Exceptions, amendments)

    expect(result).toBe(false)
  })
})

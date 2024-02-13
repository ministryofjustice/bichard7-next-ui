import { DisplayFullCourtCase } from "types/display/CourtCases"
import editableFieldsValidationError from "./editableFieldsValidationError"
import createDummyAho from "../../test/helpers/createDummyAho"
import HO100102 from "../../test/helpers/exceptions/HO100102"
import HO100300 from "../../test/helpers/exceptions/HO100300"
import HO100206 from "../../test/helpers/exceptions/HO100206"

describe("EditableFieldsValidationError", () => {
  const dummyAho = createDummyAho()

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
      dummyAho.Exceptions.length = 0
      HO100102(dummyAho)
      HO100300(dummyAho)
      const courtCase = {
        aho: dummyAho
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
    dummyAho.Exceptions.length = 0
    HO100206(dummyAho)
    HO100102(dummyAho)
    const courtCase = {
      aho: dummyAho
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
    dummyAho.Exceptions.length = 0
    HO100102(dummyAho)
    const courtCase = {
      aho: dummyAho
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
    dummyAho.Exceptions.length = 0
    HO100300(dummyAho)
    const courtCase = {
      aho: dummyAho
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

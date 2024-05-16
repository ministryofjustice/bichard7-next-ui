import { DisplayFullCourtCase } from "types/display/CourtCases"
import areEditableFieldsAmended from "./areEditableFieldsAmended"
import createDummyAho from "../../test/helpers/createDummyAho"
import HO100102 from "../../test/helpers/exceptions/HO100102"
import HO100300 from "../../test/helpers/exceptions/HO100300"
import HO100206 from "../../test/helpers/exceptions/HO100206"

describe("areEditableFieldsAmended", () => {
  const dummyAho = createDummyAho()

  it.each([
    ["1101ZD0100000448754K", "B21XA00", "2025-02-10", true],
    ["", "B21XA00", "2025-02-10", true],
    ["1101ZD0100000448754K", "", "2025-02-10", true],
    ["1101ZD0100000448754K", "B21XA00", "", true],
    ["", "", "2025-02-10", true],
    ["", "B21XA00", "", true],
    ["1101ZD0100000448754K", "", "", true],
    ["", "", "", false]
  ])(
    "should return validation error according to value entered into editable fields",
    (asn: string, nextHearingLocationValue: string, nextHearingDateValue: string, isValid: boolean) => {
      dummyAho.Exceptions.length = 0
      HO100206(dummyAho)
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
            value: nextHearingLocationValue
          }
        ],
        nextHearingDate: [
          {
            resultIndex: 0,
            offenceIndex: 0,
            value: nextHearingDateValue
          }
        ]
      }

      const result = areEditableFieldsAmended(courtCase, amendments)

      expect(result).toBe(isValid)
    }
  )

  it("Should return false when ASN exception and Next-hearing-date exceptions are raised and both editable fields are empty", () => {
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
          value: ""
        }
      ]
    }

    const result = areEditableFieldsAmended(courtCase, amendments)

    expect(result).toBe(false)
  })

  it("Should return true when Next-hearing-date exception is raised and asn editable field is empty", () => {
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
          value: "2025-02-10"
        }
      ]
    }

    const result = areEditableFieldsAmended(courtCase, amendments)

    expect(result).toBe(true)
  })

  it("Should return true when Next-hearing-location exception is raised and asn editable fields is empty", () => {
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
          value: "B01EF01"
        }
      ]
    }

    const result = areEditableFieldsAmended(courtCase, amendments)

    expect(result).toBe(true)
  })
})

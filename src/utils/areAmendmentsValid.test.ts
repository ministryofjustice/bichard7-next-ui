import { DisplayFullCourtCase } from "types/display/CourtCases"
import createDummyAho from "../../test/helpers/createDummyAho"
import { HO100310 } from "../../test/helpers/exceptions"
import HO100102 from "../../test/helpers/exceptions/HO100102"
import HO100206 from "../../test/helpers/exceptions/HO100206"
import HO100300 from "../../test/helpers/exceptions/HO100300"
import areAmendmentsValid from "./areAmendmentsValid"
import isOffenceMatchingValid from "./isOffenceMatchingValid"

jest.mock("./isOffenceMatchingValid", () => jest.fn())

describe("areAmendmentsValid", () => {
  const dummyAho = createDummyAho()

  beforeEach(() => {
    ;(isOffenceMatchingValid as jest.Mock).mockReturnValue(true)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it.each([
    ["1101ZD0100000448754K", "B21XA00", "2025-02-10", true],
    ["", "B21XA00", "2025-02-10", true],
    ["1101ZD0100000448754K", "", "2025-02-10", false],
    ["1101ZD0100000448754K", "B21XA00", "", false],
    ["", "", "2025-02-10", false],
    ["", "B21XA00", "", false],
    ["1101ZD0100000448754K", "", "", false],
    ["", "", "", false]
  ])(
    "should return validation error according to value entered into editable fields",
    (asn: string, nextHearingLocationValue: string, nextHearingDateValue: string, isValid: boolean) => {
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

      const result = areAmendmentsValid(courtCase, amendments)

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

    const result = areAmendmentsValid(courtCase, amendments)

    expect(result).toBe(false)
  })

  it("Should return true when Next-hearing-date exception is raised and asn editable fields is empty", () => {
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

    const result = areAmendmentsValid(courtCase, amendments)

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

    const result = areAmendmentsValid(courtCase, amendments)

    expect(result).toBe(true)
  })

  it("calls offence matching validator", () => {
    dummyAho.Exceptions.length = 0
    const courtCase = {
      aho: HO100310(dummyAho)
    } as unknown as DisplayFullCourtCase

    areAmendmentsValid(courtCase, {})
    expect(isOffenceMatchingValid as jest.Mock).toHaveBeenCalledTimes(1)
  })

  it("returns false if offence matching is invalid", () => {
    ;(isOffenceMatchingValid as jest.Mock).mockReturnValue(false)

    const courtCase = {
      aho: HO100310(dummyAho)
    } as unknown as DisplayFullCourtCase

    const result = areAmendmentsValid(courtCase, {})
    expect(result).toBe(false)
  })

  it("returns true if offence matching is valid", () => {
    ;(isOffenceMatchingValid as jest.Mock).mockReturnValue(true)

    const courtCase = {
      aho: HO100310(dummyAho)
    } as unknown as DisplayFullCourtCase

    const result = areAmendmentsValid(courtCase, {})
    expect(result).toBe(true)
  })
})

import { AmendmentRecords } from "../types/Amendments"
import nextHearingLocationValidationError from "./nextHearingLocationValidationError"
import createDummyAho from "../../test/helpers/createDummyAho"
import HO100300 from "../../test/helpers/exceptions/HO100300"
import HO100322 from "../../test/helpers/exceptions/HO100322"

describe("nextHearingLocationValidationError", () => {
  const dummyAho = createDummyAho()

  it("should return true if next hearing location editable field is empty", () => {
    dummyAho.Exceptions.length = 0
    HO100300(dummyAho)

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
    const result = nextHearingLocationValidationError(dummyAho.Exceptions, amendments)

    expect(result).toBe(true)
  })

  it("should return false if a value is entered into the next hearing date editable field", () => {
    dummyAho.Exceptions.length = 0
    HO100300(dummyAho)

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
    const result = nextHearingLocationValidationError(dummyAho.Exceptions, amendments)

    expect(result).toBe(false)
  })

  it("should return true if one of the next hearing location editable fields remained empty", () => {
    dummyAho.Exceptions.length = 0
    HO100300(dummyAho)
    HO100322(dummyAho)

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
    const result = nextHearingLocationValidationError(dummyAho.Exceptions, amendments)

    expect(result).toBe(true)
  })

  it("should return false if multiple hearing location editable fields have values", () => {
    dummyAho.Exceptions.length = 0
    HO100300(dummyAho)
    HO100322(dummyAho)

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
    const result = nextHearingLocationValidationError(dummyAho.Exceptions, amendments)

    expect(result).toBe(false)
  })
})

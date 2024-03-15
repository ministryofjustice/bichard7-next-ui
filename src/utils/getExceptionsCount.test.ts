import { DisplayFullCourtCase } from "types/display/CourtCases"
import {
  getAsnExceptionCount,
  getExceptionsCount,
  getNextHearingDateExceptionsCount,
  getNextHearingLocationExceptionsCount
} from "./getExceptionsCount"
import { AmendmentRecords } from "types/Amendments"
import createDummyAho from "../../test/helpers/createDummyAho"
import HO100206 from "../../test/helpers/exceptions/HO100206"
import HO100321 from "../../test/helpers/exceptions/HO100321"
import HO100102 from "../../test/helpers/exceptions/HO100102"
import HO100323 from "../../test/helpers/exceptions/HO100323"
import HO100200 from "../../test/helpers/exceptions/HO100200"
import HO100300 from "../../test/helpers/exceptions/HO100300"
import HO100322 from "../../test/helpers/exceptions/HO100322"

const dummyAho = createDummyAho()

describe("getAsnExceptionCount", () => {
  it("Should return 1 when ASN exception is raised", () => {
    dummyAho.Exceptions.length = 0
    HO100206(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {} as AmendmentRecords

    const asnExceptionCount = getAsnExceptionCount(courtCase.aho.Exceptions, updatedFields)

    expect(asnExceptionCount).toBe(1)
  })

  it("Should return 0 when ASN exception is resolved", () => {
    dummyAho.Exceptions.length = 0
    HO100321(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {
      asn: "1101ZD0100000448754K"
    } as AmendmentRecords

    const asnExceptionCount = getAsnExceptionCount(courtCase.aho.Exceptions, updatedFields)

    expect(asnExceptionCount).toBe(0)
  })

  it("Should return 0 when ASN exception is not raised", () => {
    dummyAho.Exceptions.length = 0
    HO100102(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {} as AmendmentRecords

    const asnExceptionCount = getAsnExceptionCount(courtCase.aho.Exceptions, updatedFields)

    expect(asnExceptionCount).toBe(0)
  })
})

describe("getNextHearingDateExceptionsCount", () => {
  it("Should return 1 when HO100102 is raises", () => {
    dummyAho.Exceptions.length = 0
    HO100102(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {} as AmendmentRecords

    const nextHearingDateExceptionsCount = getNextHearingDateExceptionsCount(courtCase.aho.Exceptions, updatedFields)

    expect(nextHearingDateExceptionsCount).toBe(1)
  })

  it("Should return 2 when HO100102 and HO100323 are raises", () => {
    dummyAho.Exceptions.length = 0
    HO100102(dummyAho)
    HO100323(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {} as AmendmentRecords

    const nextHearingDateExceptionsCount = getNextHearingDateExceptionsCount(courtCase.aho.Exceptions, updatedFields)

    expect(nextHearingDateExceptionsCount).toBe(2)
  })

  it("Should return 0 when a next-hearing-date exception is resolved", () => {
    dummyAho.Exceptions.length = 0
    HO100102(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          updatedValue: "2002-10-10"
        }
      ]
    } as AmendmentRecords

    const nextHearingDateExceptionsCount = getNextHearingDateExceptionsCount(courtCase.aho.Exceptions, updatedFields)

    expect(nextHearingDateExceptionsCount).toBe(0)
  })

  it("Should return 0 when multiple next-hearing-date exceptions are resolved", () => {
    dummyAho.Exceptions.length = 0
    HO100102(dummyAho)
    HO100323(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          updatedValue: "2025-10-10"
        },
        {
          resultIndex: 0,
          offenceIndex: 1,
          updatedValue: "2026-10-10"
        }
      ]
    } as AmendmentRecords

    const nextHearingDateExceptionsCount = getNextHearingDateExceptionsCount(courtCase.aho.Exceptions, updatedFields)

    expect(nextHearingDateExceptionsCount).toBe(0)
  })

  it("Should return 0 when next-hearing-date exception is not raised", () => {
    dummyAho.Exceptions.length = 0
    HO100206(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {} as AmendmentRecords

    const nextHearingDateExceptionsCount = getNextHearingDateExceptionsCount(courtCase.aho.Exceptions, updatedFields)

    expect(nextHearingDateExceptionsCount).toBe(0)
  })
})

describe("getNextHearingLocationExceptionsCount", () => {
  it.each([[HO100200], [HO100300], [HO100322]])(
    "Should return 1 when either of next-hearing-location exception is raised",
    (nextHearingLocationException) => {
      dummyAho.Exceptions.length = 0
      nextHearingLocationException(dummyAho)
      const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
      const updatedFields = {} as AmendmentRecords

      const nextHearingLocationExceptionsCount = getNextHearingLocationExceptionsCount(
        courtCase.aho.Exceptions,
        updatedFields
      )

      expect(nextHearingLocationExceptionsCount).toBe(1)
    }
  )

  it("Should return 2 when HO100200 and HO100300 are raised", () => {
    dummyAho.Exceptions.length = 0
    HO100200(dummyAho)
    HO100300(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {} as AmendmentRecords

    const nextHearingLocationExceptionsCount = getNextHearingLocationExceptionsCount(
      courtCase.aho.Exceptions,
      updatedFields
    )

    expect(nextHearingLocationExceptionsCount).toBe(2)
  })

  it("Should return 3 when HO100200, HO100300 and HO100322 are raised", () => {
    dummyAho.Exceptions.length = 0
    HO100200(dummyAho)
    HO100300(dummyAho)
    HO100322(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {} as AmendmentRecords

    const nextHearingLocationExceptionsCount = getNextHearingLocationExceptionsCount(
      courtCase.aho.Exceptions,
      updatedFields
    )

    expect(nextHearingLocationExceptionsCount).toBe(3)
  })

  it("Should return 0 when a next-hearing-location exception is resolved", () => {
    dummyAho.Exceptions.length = 0
    HO100200(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {
      nextSourceOrganisation: [
        {
          resultIndex: 0,
          offenceIndex: 1,
          updatedValue: "B21XA00"
        }
      ]
    } as AmendmentRecords

    const nextHearingLocationExceptionsCount = getNextHearingLocationExceptionsCount(
      courtCase.aho.Exceptions,
      updatedFields
    )

    expect(nextHearingLocationExceptionsCount).toBe(0)
  })

  it("Should return 0 when multiple next-hearing-location exceptions are resolved", () => {
    dummyAho.Exceptions.length = 0
    HO100200(dummyAho)
    HO100300(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {
      nextSourceOrganisation: [
        {
          resultIndex: 0,
          offenceIndex: 1,
          updatedValue: "B21XA00"
        },
        {
          resultIndex: 1,
          offenceIndex: 2,
          updatedValue: "B21XA11"
        }
      ]
    } as AmendmentRecords

    const nextHearingLocationExceptionsCount = getNextHearingLocationExceptionsCount(
      courtCase.aho.Exceptions,
      updatedFields
    )

    expect(nextHearingLocationExceptionsCount).toBe(0)
  })

  it("Should return 0 when no next-hearing-location exception is raised", () => {
    dummyAho.Exceptions.length = 0
    HO100206(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {} as AmendmentRecords

    const nextHearingLocationExceptionsCount = getNextHearingLocationExceptionsCount(
      courtCase.aho.Exceptions,
      updatedFields
    )

    expect(nextHearingLocationExceptionsCount).toBe(0)
  })
})

describe("getExceptionsCount", () => {
  it.each([
    ["Defendant", 1, "asn", [HO100206], 0],
    ["Offences", 1, "next-hearing-date", [HO100102], 1],
    ["Offences", 2, "next-hearing-date", [HO100102, HO100323], 1],
    ["Offences", 1, "next-hearing-location", [HO100200], 1],
    ["Offences", 2, "next-hearing-location", [HO100200, HO100300], 1],
    ["Offences", 3, "next-hearing-location", [HO100200, HO100300, HO100322], 1],
    ["Offences", 4, "next-hearing-date and next-hearing-location", [HO100200, HO100300, HO100322, HO100102], 1]
  ])(
    "Should return %s as a tab and %s as exceptionCount when %s exception(s) are raised",
    (tab: string, exceptionsCount: number, typeOfException: string, exceptions, index: number) => {
      const exceptionType = typeOfException
      dummyAho.Exceptions.length = 0
      exceptions.map((exception) => exception(dummyAho))
      const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
      const updatedFields = {} as AmendmentRecords

      const exceptionsDetails = getExceptionsCount(courtCase.aho.Exceptions, updatedFields)

      expect(exceptionsDetails[index].tab).toBe(tab)
      expect(exceptionsDetails[index].exceptionsCount).toBe(exceptionsCount)
      expect(exceptionType).toBe(typeOfException)
    }
  )
})

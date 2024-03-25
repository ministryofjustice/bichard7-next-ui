import { DisplayFullCourtCase } from "types/display/CourtCases"
import {
  getAsnExceptionDetails,
  getExceptionsNotifications,
  getNextHearingDateExceptionsDetails,
  getNextHearingLocationExceptionsDetails
} from "./getExceptionsNotifications"
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

describe("getAsnExceptionDetails", () => {
  it("Should return ExceptionsCount:1, ExceptionsResolved:false when ASN exception is raised", () => {
    dummyAho.Exceptions.length = 0
    HO100206(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {} as AmendmentRecords

    const asnException = getAsnExceptionDetails(courtCase.aho.Exceptions, updatedFields)

    expect(asnException.ExceptionsCount).toBe(1)
    expect(asnException.ExceptionsResolved).toBe(false)
  })

  it("Should return ExceptionsCount:0, ExceptionsResolved:true when ASN exception is resolved", () => {
    dummyAho.Exceptions.length = 0
    HO100321(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {
      asn: "1101ZD0100000448754K"
    } as AmendmentRecords

    const asnException = getAsnExceptionDetails(courtCase.aho.Exceptions, updatedFields)

    expect(asnException.ExceptionsCount).toBe(0)
    expect(asnException.ExceptionsResolved).toBe(true)
  })

  it("Should return ExceptionsCount:0, ExceptionsResolved:false when ASN exception is not raised", () => {
    dummyAho.Exceptions.length = 0
    HO100102(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {} as AmendmentRecords

    const asnException = getAsnExceptionDetails(courtCase.aho.Exceptions, updatedFields)

    expect(asnException.ExceptionsCount).toBe(0)
    expect(asnException.ExceptionsResolved).toBe(false)
  })
})

describe("getNextHearingDateExceptionsDetails", () => {
  it("Should return ExceptionsCount:1, ExceptionsResolved:false when HO100102 is raised", () => {
    dummyAho.Exceptions.length = 0
    HO100102(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {} as AmendmentRecords

    const nextHearingDateExceptions = getNextHearingDateExceptionsDetails(courtCase.aho.Exceptions, updatedFields)

    expect(nextHearingDateExceptions.ExceptionsCount).toBe(1)
    expect(nextHearingDateExceptions.ExceptionsResolved).toBe(false)
  })

  it("Should return ExceptionsCount:2, ExceptionsResolved:false when HO100102 and HO100323 are raised", () => {
    dummyAho.Exceptions.length = 0
    HO100102(dummyAho)
    HO100323(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {} as AmendmentRecords

    const nextHearingDateExceptions = getNextHearingDateExceptionsDetails(courtCase.aho.Exceptions, updatedFields)

    expect(nextHearingDateExceptions.ExceptionsCount).toBe(2)
    expect(nextHearingDateExceptions.ExceptionsResolved).toBe(false)
  })

  it("Should return ExceptionsCount:0, ExceptionsResolved:true when a next-hearing-date exception is resolved", () => {
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

    const nextHearingDateExceptions = getNextHearingDateExceptionsDetails(courtCase.aho.Exceptions, updatedFields)

    expect(nextHearingDateExceptions.ExceptionsCount).toBe(0)
    expect(nextHearingDateExceptions.ExceptionsResolved).toBe(true)
  })

  it("Should return ExceptionsCount:0, ExceptionsResolved:true when multiple next-hearing-date exceptions are resolved", () => {
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

    const nextHearingDateExceptions = getNextHearingDateExceptionsDetails(courtCase.aho.Exceptions, updatedFields)

    expect(nextHearingDateExceptions.ExceptionsCount).toBe(0)
    expect(nextHearingDateExceptions.ExceptionsResolved).toBe(true)
  })

  it("Should return ExceptionsCount:0, ExceptionsResolved:false when next-hearing-date exception is not raised", () => {
    dummyAho.Exceptions.length = 0
    HO100206(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {} as AmendmentRecords

    const nextHearingDateExceptions = getNextHearingDateExceptionsDetails(courtCase.aho.Exceptions, updatedFields)

    expect(nextHearingDateExceptions.ExceptionsCount).toBe(0)
    expect(nextHearingDateExceptions.ExceptionsResolved).toBe(false)
  })
})

describe("getNextHearingLocationExceptionsDetails", () => {
  it.each([[HO100200], [HO100300], [HO100322]])(
    "Should return ExceptionsCount:1, ExceptionsResolved:false when either of next-hearing-location exception is raised",
    (nextHearingLocationException) => {
      dummyAho.Exceptions.length = 0
      nextHearingLocationException(dummyAho)
      const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
      const updatedFields = {} as AmendmentRecords

      const nextHearingLocationExceptions = getNextHearingLocationExceptionsDetails(
        courtCase.aho.Exceptions,
        updatedFields
      )

      expect(nextHearingLocationExceptions.ExceptionsCount).toBe(1)
      expect(nextHearingLocationExceptions.ExceptionsResolved).toBe(false)
    }
  )

  it("Should return ExceptionsCount:2, ExceptionsResolved:false when HO100200 and HO100300 are raised", () => {
    dummyAho.Exceptions.length = 0
    HO100200(dummyAho)
    HO100300(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {} as AmendmentRecords

    const nextHearingLocationExceptions = getNextHearingLocationExceptionsDetails(
      courtCase.aho.Exceptions,
      updatedFields
    )

    expect(nextHearingLocationExceptions.ExceptionsCount).toBe(2)
    expect(nextHearingLocationExceptions.ExceptionsResolved).toBe(false)
  })

  it("Should return ExceptionsCount:3, ExceptionsResolved:false when HO100200, HO100300 and HO100322 are raised", () => {
    dummyAho.Exceptions.length = 0
    HO100200(dummyAho)
    HO100300(dummyAho)
    HO100322(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {} as AmendmentRecords

    const nextHearingLocationExceptions = getNextHearingLocationExceptionsDetails(
      courtCase.aho.Exceptions,
      updatedFields
    )

    expect(nextHearingLocationExceptions.ExceptionsCount).toBe(3)
    expect(nextHearingLocationExceptions.ExceptionsResolved).toBe(false)
  })

  it("Should return ExceptionsCount:0, ExceptionsResolved:true when a next-hearing-location exception is resolved", () => {
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

    const nextHearingLocationExceptions = getNextHearingLocationExceptionsDetails(
      courtCase.aho.Exceptions,
      updatedFields
    )

    expect(nextHearingLocationExceptions.ExceptionsCount).toBe(0)
    expect(nextHearingLocationExceptions.ExceptionsResolved).toBe(true)
  })

  it("Should return ExceptionsCount:0, ExceptionsResolved:true when multiple next-hearing-location exceptions are resolved", () => {
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

    const nextHearingLocationExceptions = getNextHearingLocationExceptionsDetails(
      courtCase.aho.Exceptions,
      updatedFields
    )

    expect(nextHearingLocationExceptions.ExceptionsCount).toBe(0)
    expect(nextHearingLocationExceptions.ExceptionsResolved).toBe(true)
  })

  it("Should return ExceptionsCount:0, ExceptionsResolved:false when no next-hearing-location exception is raised", () => {
    dummyAho.Exceptions.length = 0
    HO100206(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {} as AmendmentRecords

    const nextHearingLocationExceptions = getNextHearingLocationExceptionsDetails(
      courtCase.aho.Exceptions,
      updatedFields
    )

    expect(nextHearingLocationExceptions.ExceptionsCount).toBe(0)
    expect(nextHearingLocationExceptions.ExceptionsResolved).toBe(false)
  })
})

describe("getExceptionsNotifications", () => {
  it.each([
    ["Defendant", 1, "asn", [HO100206], 0],
    ["Offences", 1, "next-hearing-date", [HO100102], 3],
    ["Offences", 2, "next-hearing-date", [HO100102, HO100323], 3],
    ["Offences", 1, "next-hearing-location", [HO100200], 3],
    ["Offences", 2, "next-hearing-location", [HO100200, HO100300], 3],
    ["Offences", 3, "next-hearing-location", [HO100200, HO100300, HO100322], 3],
    ["Offences", 4, "next-hearing-date and next-hearing-location", [HO100200, HO100300, HO100322, HO100102], 3]
  ])(
    "Should return %s as a tab and %s as exceptionCount when %s exception(s) are raised",
    (tab: string, exceptionsCount: number, typeOfException: string, exceptions, index: number) => {
      const exceptionType = typeOfException
      dummyAho.Exceptions.length = 0
      exceptions.map((exception) => exception(dummyAho))
      const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
      const updatedFields = {} as AmendmentRecords

      const exceptionsDetails = getExceptionsNotifications(courtCase.aho.Exceptions, updatedFields)

      expect(exceptionsDetails[index].tab).toBe(tab)
      expect(exceptionsDetails[index].exceptionsCount).toBe(exceptionsCount)
      expect(exceptionType).toBe(typeOfException)
    }
  )
})
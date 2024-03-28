import { Amendments } from "types/Amendments"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import getOffenceAlertsDetails, {
  nextHearingDateExceptionResolvedFn,
  nextHearingLocationExceptionResolvedFn
} from "./getOffenceAlertsDetails"
import createDummyAho from "../../test/helpers/createDummyAho"
import { HO100102, HO100322 } from "../../test/helpers/exceptions"
import { DisplayFullCourtCase } from "types/display/CourtCases"

const nextHearingDateException = {
  code: ExceptionCode.HO100102,
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

const nextHearingLocationException = {
  code: ExceptionCode.HO100322,
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

describe("nextHearingDateExceptionResolvedFn", () => {
  it("Should return true when relevant exception is resolved", () => {
    const updatedFields = {
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          value: "2024-03-30"
        }
      ]
    } as Amendments

    const nextHearingDateExceptionResolved = nextHearingDateExceptionResolvedFn(
      updatedFields,
      nextHearingDateException,
      0
    )

    expect(nextHearingDateExceptionResolved).toBe(true)
  })

  it("Should return false when exception is not resolved", () => {
    const updatedFields = {} as Amendments

    const nextHearingDateExceptionResolved = nextHearingDateExceptionResolvedFn(
      updatedFields,
      nextHearingDateException,
      0
    )

    expect(nextHearingDateExceptionResolved).toBe(false)
  })

  it("Should return false when irrelevant exception is resolved", () => {
    const updatedFields = {
      nextSourceOrganisation: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          value: "B21XA00"
        }
      ]
    } as Amendments

    const nextHearingDateExceptionResolved = nextHearingDateExceptionResolvedFn(
      updatedFields,
      nextHearingDateException,
      0
    )

    expect(nextHearingDateExceptionResolved).toBe(false)
  })

  it("Should return false when exception is resolved in different offence", () => {
    const updatedFields = {
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 1,
          value: "2024-03-30"
        }
      ]
    } as Amendments

    const nextHearingDateExceptionResolved = nextHearingDateExceptionResolvedFn(
      updatedFields,
      nextHearingLocationException,
      0
    )

    expect(nextHearingDateExceptionResolved).toBe(false)
  })

  it("Should return false when currepted data is found in updatedFields", () => {
    const updatedFields = {
      nextHearingDate: undefined
    } as unknown as Amendments

    const nextHearingDateExceptionResolved = nextHearingDateExceptionResolvedFn(
      updatedFields,
      nextHearingDateException,
      0
    )

    expect(nextHearingDateExceptionResolved).toBe(false)
  })

  it("Should return false when currepted offenceIndex is found in updatedFields", () => {
    const updatedFields = {
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: undefined,
          value: "2024-03-30"
        }
      ]
    } as unknown as Amendments

    const nextHearingDateExceptionResolved = nextHearingDateExceptionResolvedFn(
      updatedFields,
      nextHearingDateException,
      0
    )

    expect(nextHearingDateExceptionResolved).toBe(false)
  })
})

describe("nextHearingLocationExceptionResolvedFn", () => {
  it("Should return true when relevant exception is resolved", () => {
    const updatedFields = {
      nextSourceOrganisation: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          value: "B21XA00"
        }
      ]
    } as Amendments

    const nextHearingLocationResolved = nextHearingLocationExceptionResolvedFn(
      updatedFields,
      nextHearingLocationException,
      0
    )

    expect(nextHearingLocationResolved).toBe(true)
  })

  it("Should return false when exception is not resolved", () => {
    const updatedFields = {} as Amendments

    const nextHearingLocationResolved = nextHearingLocationExceptionResolvedFn(
      updatedFields,
      nextHearingLocationException,
      0
    )

    expect(nextHearingLocationResolved).toBe(false)
  })

  it("Should return false when irrelevant exception is resolved", () => {
    const updatedFields = {
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          value: "2024-03-30"
        }
      ]
    } as Amendments

    const nextHearingLocationResolved = nextHearingLocationExceptionResolvedFn(
      updatedFields,
      nextHearingDateException,
      0
    )

    expect(nextHearingLocationResolved).toBe(false)
  })

  it("Should return false when exception is resolved in different offence", () => {
    const exception = nextHearingLocationException
    const updatedFields = {
      nextSourceOrganisation: [
        {
          resultIndex: 0,
          offenceIndex: 1,
          value: "B21XA00"
        }
      ]
    } as Amendments

    const nextHearingDateExceptionResolved = nextHearingDateExceptionResolvedFn(updatedFields, exception, 0)

    expect(nextHearingDateExceptionResolved).toBe(false)
  })

  it("Should return false when currepted data is found in updatedFields", () => {
    const updatedFields = {
      nextSourceOrganisation: undefined
    } as unknown as Amendments

    const nextHearingLocationResolved = nextHearingLocationExceptionResolvedFn(
      updatedFields,
      nextHearingLocationException,
      0
    )

    expect(nextHearingLocationResolved).toBe(false)
  })

  it("Should return false when currepted offenceIndex is found in updatedFields", () => {
    const updatedFields = {
      nextSourceOrganisation: [
        {
          resultIndex: 0,
          offenceIndex: 1,
          value: "B21XA00"
        }
      ]
    } as Amendments

    const nextHearingDateExceptionResolved = nextHearingDateExceptionResolvedFn(
      updatedFields,
      nextHearingDateException,
      0
    )

    expect(nextHearingDateExceptionResolved).toBe(false)
  })
})

describe("getOffenceAlertDetails", () => {
  const dummyAho = createDummyAho()

  it("Should return only one element when both exceptions have same offence indexes", () => {
    dummyAho.Exceptions.length = 0
    HO100102(dummyAho)
    HO100322(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {} as Amendments

    const offenceAlertDetails = getOffenceAlertsDetails(courtCase.aho.Exceptions, updatedFields)

    expect(offenceAlertDetails.length).toBe(1)
    expect(offenceAlertDetails[0].offenceIndex).toBe(0)
    expect(offenceAlertDetails[0].isResolved).toBe(false)
  })

  it("Should return two elements when both exceptions have different offence indexes", () => {
    const exceptions = [nextHearingDateException, nextHearingLocationException]
    const updatedFields = {} as Amendments

    const offenceAlertDetails = getOffenceAlertsDetails(exceptions, updatedFields)

    expect(offenceAlertDetails.length).toBe(2)
    expect(offenceAlertDetails[0].offenceIndex).toBe(0)
    expect(offenceAlertDetails[0].isResolved).toBe(false)
    expect(offenceAlertDetails[1].offenceIndex).toBe(1)
    expect(offenceAlertDetails[1].isResolved).toBe(false)
  })

  it("Should return isResolved:true for the first offence when only first one is resolved out of the two with different offence indexes", () => {
    const exceptions = [nextHearingDateException, nextHearingLocationException]
    const updatedFields = {
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          value: "2002-10-10"
        }
      ]
    } as Amendments

    const offenceAlertDetails = getOffenceAlertsDetails(exceptions, updatedFields)

    expect(offenceAlertDetails.length).toBe(2)
    expect(offenceAlertDetails[0].offenceIndex).toBe(0)
    expect(offenceAlertDetails[0].isResolved).toBe(true)
    expect(offenceAlertDetails[1].offenceIndex).toBe(1)
    expect(offenceAlertDetails[1].isResolved).toBe(false)
  })

  it("Should return isResolved:false when only one exception is resolved out of two having same indexes", () => {
    dummyAho.Exceptions.length = 0
    HO100102(dummyAho)
    HO100322(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          value: "2002-10-10"
        }
      ]
    } as Amendments

    const offenceAlertDetails = getOffenceAlertsDetails(courtCase.aho.Exceptions, updatedFields)

    expect(offenceAlertDetails.length).toBe(1)
    expect(offenceAlertDetails[0].offenceIndex).toBe(0)
    expect(offenceAlertDetails[0].isResolved).toBe(false)
  })

  it("Should return isResolved:true when both of the exceptions having same indexes are resolved", () => {
    dummyAho.Exceptions.length = 0
    HO100102(dummyAho)
    HO100322(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          value: "2002-10-10"
        }
      ],
      nextSourceOrganisation: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          value: "B21XA00"
        }
      ]
    } as Amendments

    const offenceAlertDetails = getOffenceAlertsDetails(courtCase.aho.Exceptions, updatedFields)

    expect(offenceAlertDetails.length).toBe(1)
    expect(offenceAlertDetails[0].offenceIndex).toBe(0)
    expect(offenceAlertDetails[0].isResolved).toBe(true)
  })
})

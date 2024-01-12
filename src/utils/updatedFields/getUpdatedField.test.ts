import {
  AnnotatedHearingOutcome,
  Offence,
  Result
} from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import getUpdatedFields from "./getUpdatedFields"
import { cloneDeep } from "lodash"

describe("getUpdatedFields", () => {
  const updatedNextHearingDateValue = "2012-12-13"
  const updatedOrganisationUnitCode = "Updated OU code"
  const updatedAsn = "Updated ASN"
  let aho: AnnotatedHearingOutcome

  beforeEach(() => {
    const OffenceResult = {
      NextHearingDate: "2012-12-12",
      NextResultSourceOrganisation: { OrganisationUnitCode: "originalOUCode" }
    } as Result

    const offence = {
      Result: [OffenceResult, cloneDeep(OffenceResult), cloneDeep(OffenceResult)]
    } as Offence

    aho = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {
            HearingDefendant: {
              ArrestSummonsNumber: "Original ASN",
              Offence: [offence, cloneDeep(offence), cloneDeep(offence)]
            }
          }
        }
      }
    } as AnnotatedHearingOutcome
  })

  it("shouldn't return an updated value when the updates message has no amendments", () => {
    const updatedAho = {} as AnnotatedHearingOutcome

    expect(getUpdatedFields(aho, undefined)).toEqual({})
    expect(getUpdatedFields(aho, updatedAho)).toEqual({})
  })

  it("shouldn't return updates when the original and updated aho is the same", () => {
    expect(getUpdatedFields(aho, aho)).toEqual({})
  })

  it("should return the updated nextHearingDate field with the correct indexes", () => {
    const updatedAho = cloneDeep(aho)
    updatedAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      {} as Offence,
      {
        Result: [
          {
            NextHearingDate: updatedNextHearingDateValue
          } as Result
        ]
      } as Offence
    ]

    expect(getUpdatedFields(aho, updatedAho)).toEqual({
      nextHearingDate: [{ offenceIndex: 1, resultIndex: 0, updatedValue: updatedNextHearingDateValue }]
    })
  })

  it("should return the updated NextResultSourceOrganisation field with the correct indexes", () => {
    const updatedAho = cloneDeep(aho)
    updatedAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      {
        Result: [
          {} as Result,
          {} as Result,
          {
            NextResultSourceOrganisation: { OrganisationUnitCode: updatedOrganisationUnitCode }
          } as Result
        ]
      } as Offence
    ]
    expect(getUpdatedFields(aho, updatedAho)).toEqual({
      nextSourceOrganisation: [{ offenceIndex: 0, resultIndex: 2, updatedValue: updatedOrganisationUnitCode }]
    })
  })

  it("should return an updated asn with the correct value", () => {
    const updatedAho = cloneDeep(aho)
    updatedAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber = updatedAsn

    expect(getUpdatedFields(aho, updatedAho)).toEqual({
      asn: updatedAsn
    })
  })

  it("should return multiple updated fields correctly", () => {
    const updatedAho = cloneDeep(aho)
    updatedAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber = updatedAsn
    updatedAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      {} as Offence,
      {
        Result: [
          {
            NextHearingDate: updatedNextHearingDateValue,
            NextResultSourceOrganisation: { OrganisationUnitCode: updatedOrganisationUnitCode }
          } as Result
        ]
      } as Offence
    ]

    expect(getUpdatedFields(aho, updatedAho)).toEqual({
      asn: updatedAsn,
      nextHearingDate: [{ offenceIndex: 1, resultIndex: 0, updatedValue: updatedNextHearingDateValue }],
      nextSourceOrganisation: [{ offenceIndex: 1, resultIndex: 0, updatedValue: updatedOrganisationUnitCode }]
    })
  })
})

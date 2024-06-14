import { Offence } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { useCourtCase } from "context/CourtCaseContext"
import { useCallback, useEffect, useState } from "react"
import getOffenceCode from "utils/getOffenceCode"
import Badge, { BadgeColours } from "./Badge"

interface Props {
  offenceIndex: number
  offence: Offence
  isCaseLockedToCurrentUser: boolean
}

const formatOffenceString = (
  offenceReasonSequence: number | string,
  offenceCourtCaseReferenceNumber: string | undefined
): string => {
  if (offenceCourtCaseReferenceNumber === undefined || offenceCourtCaseReferenceNumber === "") {
    return `${offenceReasonSequence}`
  }

  return `${offenceReasonSequence}-${offenceCourtCaseReferenceNumber}`
}

export const OffenceMatcher = ({ offenceIndex, offence, isCaseLockedToCurrentUser }: Props) => {
  const {
    courtCase: {
      aho: { PncQuery: pncQuery }
    },
    amend,
    amendments
  } = useCourtCase()
  const offenceCode = getOffenceCode(offence)

  const findPncOffence = useCallback(() => {
    const offenceReasonSequenceValue =
      amendments.offenceReasonSequence?.find((a) => a.offenceIndex === offenceIndex)?.value ?? ""
    const offenceCourtCaseReferenceNumberValue =
      amendments.offenceCourtCaseReferenceNumber?.find((a) => a.offenceIndex === offenceIndex)?.value ?? ""

    return formatOffenceString(offenceReasonSequenceValue, offenceCourtCaseReferenceNumberValue)
  }, [amendments.offenceCourtCaseReferenceNumber, amendments.offenceReasonSequence, offenceIndex])

  const [selectedValue, setSelectedValue] = useState(findPncOffence())

  useEffect(() => {
    setSelectedValue(findPncOffence())
  }, [findPncOffence])

  const onSelectionChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ccr = e.target.options[e.target.selectedIndex].dataset.ccr ?? ""
    const offenceReasonSequence = e.target.value?.replace(/-.*/, "") ?? ""

    amend("offenceReasonSequence")({
      offenceIndex,
      value: Number(offenceReasonSequence)
    })

    amend("offenceCourtCaseReferenceNumber")({
      offenceIndex,
      value: ccr
    })

    setSelectedValue(formatOffenceString(offenceReasonSequence, ccr))
  }

  const offenceAlreadySelected = (sequenceNumber: number, courtCaseReference: string): boolean => {
    const knownMatches: string[] = []

    amendments.offenceCourtCaseReferenceNumber?.forEach((offenceCcr) => {
      const offenceReasonSequence = amendments.offenceReasonSequence?.find(
        (a) => a.offenceIndex === offenceCcr.offenceIndex && a.offenceIndex !== offenceIndex
      )

      if (offenceReasonSequence?.value) {
        knownMatches.push(formatOffenceString(offenceReasonSequence.value, offenceCcr.value))
      }
    })

    return knownMatches.includes(formatOffenceString(sequenceNumber, courtCaseReference))
  }

  // TODO: match dates
  return isCaseLockedToCurrentUser ? (
    <select className="govuk-select offence-matcher" onChange={onSelectionChanged} value={selectedValue}>
      <option disabled hidden value="">
        {"Select an offence"}
      </option>
      {pncQuery?.courtCases?.map((c) => {
        return (
          <optgroup key={c.courtCaseReference} label={c.courtCaseReference}>
            {c.offences
              .filter((pnc) => pnc.offence.cjsOffenceCode === offenceCode)
              .map((pnc, index) => {
                return (
                  <option
                    key={`${index}-${pnc.offence.cjsOffenceCode}`}
                    value={formatOffenceString(pnc.offence.sequenceNumber, c.courtCaseReference)}
                    disabled={offenceAlreadySelected(pnc.offence.sequenceNumber, c.courtCaseReference)}
                    data-ccr={c.courtCaseReference}
                  >
                    {`${String(pnc.offence.sequenceNumber).padStart(3, "0")} - ${pnc.offence.cjsOffenceCode}`}
                  </option>
                )
              })}
          </optgroup>
        )
      })}
      <option value="0">{"Added in court"}</option>
    </select>
  ) : (
    <Badge isRendered={true} colour={BadgeColours.Purple} label={"Unmatched"} className="moj-badge--large" />
  )
}

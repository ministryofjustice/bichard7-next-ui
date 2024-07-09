import { useCourtCase } from "context/CourtCaseContext"
import { useCallback, useEffect, useState } from "react"
import offenceAlreadySelected from "utils/offenceMatcher/offenceAlreadySelected"
import offenceMatcherSelectValue from "utils/offenceMatcher/offenceMatcherSelectValue"
import Badge, { BadgeColours } from "./Badge"
import type { PossibleMatchingOffence } from "../types/OffenceMatching"

interface Props {
  offenceIndex: number
  possibleMatches?: PossibleMatchingOffence[]
  isCaseLockedToCurrentUser: boolean
}

export const OffenceMatcher = ({ offenceIndex, possibleMatches, isCaseLockedToCurrentUser }: Props) => {
  const { amend, amendments } = useCourtCase()

  const findPncOffence = useCallback(() => {
    const offenceReasonSequenceValue =
      amendments.offenceReasonSequence?.find((a) => a.offenceIndex === offenceIndex)?.value ?? ""
    const offenceCourtCaseReferenceNumberValue =
      amendments.offenceCourtCaseReferenceNumber?.find((a) => a.offenceIndex === offenceIndex)?.value ?? ""

    return offenceMatcherSelectValue(offenceReasonSequenceValue, offenceCourtCaseReferenceNumberValue)
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

    setSelectedValue(offenceMatcherSelectValue(offenceReasonSequence, ccr))
  }

  return isCaseLockedToCurrentUser ? (
    <select className="govuk-select offence-matcher" onChange={onSelectionChanged} value={selectedValue}>
      <option disabled hidden value="">
        {"Select an offence"}
      </option>
      {possibleMatches?.map((m) => {
        return (
          <optgroup key={m.courtCaseReference} label={m.courtCaseReference}>
            {m.offences.map((pnc, index) => {
              return (
                <option
                  key={`${index}-${pnc.offence.cjsOffenceCode}`}
                  value={offenceMatcherSelectValue(pnc.offence.sequenceNumber, m.courtCaseReference)}
                  disabled={offenceAlreadySelected(
                    amendments,
                    offenceIndex,
                    pnc.offence.sequenceNumber,
                    m.courtCaseReference
                  )}
                  data-ccr={m.courtCaseReference}
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

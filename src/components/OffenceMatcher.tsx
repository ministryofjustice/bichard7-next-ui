import { HearingOutcome, Offence } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { useCourtCase } from "context/CourtCaseContext"
import { useCallback, useEffect, useState } from "react"
import offenceAlreadySelected from "utils/offenceMatcher/offenceAlreadySelected"
import offenceMatcherSelectValue from "utils/offenceMatcher/offenceMatcherSelectValue"
import Badge, { BadgeColours } from "./Badge"
import _getCandidate from "utils/offenceMatcher/getCandidate"
import { PncOffence } from "@moj-bichard7-developers/bichard7-next-core/core/types/PncQueryResult"

interface Props {
  offenceIndex: number
  offence: Offence
  isCaseLockedToCurrentUser: boolean
  getCandidate?: (aho: HearingOutcome, pncOffence: PncOffence, offence: Offence, caseReference: string) => boolean
}

export const OffenceMatcher = ({
  offenceIndex,
  offence,
  isCaseLockedToCurrentUser,
  getCandidate = _getCandidate
}: Props) => {
  const {
    courtCase: {
      aho: { PncQuery: pncQuery, AnnotatedHearingOutcome: aho }
    },
    amend,
    amendments
  } = useCourtCase()

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
              .filter((pnc) => getCandidate(aho.HearingOutcome, pnc, offence, c.courtCaseReference))
              .map((pnc, index) => {
                return (
                  <option
                    key={`${index}-${pnc.offence.cjsOffenceCode}`}
                    value={offenceMatcherSelectValue(pnc.offence.sequenceNumber, c.courtCaseReference)}
                    disabled={offenceAlreadySelected(
                      amendments,
                      offenceIndex,
                      pnc.offence.sequenceNumber,
                      c.courtCaseReference
                    )}
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

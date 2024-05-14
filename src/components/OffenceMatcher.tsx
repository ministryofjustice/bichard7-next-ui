import { Offence } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { useCourtCase } from "context/CourtCaseContext"
import { useState } from "react"
import getOffenceCode from "utils/getOffenceCode"
import Badge, { BadgeColours } from "./Badge"

interface Props {
  offenceIndex: number
  offence: Offence
  state: boolean
}

export const OffenceMatcher = ({ offenceIndex, offence, state }: Props) => {
  const {
    courtCase: {
      aho: { PncQuery: pncQuery }
    },
    amend,
    amendments
  } = useCourtCase()
  const offenceCode = getOffenceCode(offence)
  const [selectedValue, setSelectedValue] = useState(
    amendments.offenceReasonSequence?.find((a) => a.offenceIndex === offenceIndex)?.value ?? ""
  )

  const onSelectionChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    amend("offenceReasonSequence")({
      offenceIndex,
      value: Number(e.target.value)
    })

    amend("offenceCourtCaseReferenceNumber")({
      offenceIndex,
      value: e.target.options[e.target.selectedIndex].dataset.ccr
    })

    setSelectedValue(e.target.value)
  }

  const offenceAlreadySelected = (sequenceNumber: number) =>
    !!amendments.offenceReasonSequence?.find((a) => a.value === sequenceNumber && a.offenceIndex !== offenceIndex)

  // TODO: match dates
  return state ? (
    <select className="govuk-select offence-matcher" onChange={onSelectionChanged} value={selectedValue}>
      <option disabled hidden value="">
        {"Select an offence"}
      </option>
      {pncQuery?.courtCases?.map((c) => {
        return (
          <optgroup key={c.courtCaseReference} label={c.courtCaseReference}>
            {c.offences
              .filter((pnc) => pnc.offence.cjsOffenceCode === offenceCode)
              .map((pnc) => {
                return (
                  <option
                    key={pnc.offence.cjsOffenceCode}
                    value={pnc.offence.sequenceNumber}
                    disabled={offenceAlreadySelected(pnc.offence.sequenceNumber)}
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

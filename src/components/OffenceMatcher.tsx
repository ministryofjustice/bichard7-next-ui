import { Offence } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { useCourtCase } from "context/CourtCaseContext"
import getOffenceCode from "utils/getOffenceCode"

interface Props {
  offenceIndex: number
  offence: Offence
}

export const OffenceMatcher = ({ offenceIndex, offence }: Props) => {
  const {
    courtCase: {
      aho: { PncQuery: pncQuery }
    },
    amend,
    amendments
  } = useCourtCase()
  const offenceCode = getOffenceCode(offence)

  const onSelectionChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    amend("offenceReasonSequence")({
      offenceIndex: offenceIndex - 1,
      value: Number(e.target.value)
    })

    amend("offenceCourtCaseReferenceNumber")({
      offenceIndex: offenceIndex - 1,
      value: e.target.options[e.target.selectedIndex].dataset.ccr
    })
  }

  const isAlreadySelected = (sequenceNumber: number) =>
    !!amendments.offenceReasonSequence?.find((x) => x.value === sequenceNumber && x.offenceIndex !== offenceIndex)

  // TODO: load manually selected value if exists (just load updated aho always?)
  // TODO: match dates
  return (
    <select className="govuk-select offence-matcher" onChange={onSelectionChanged}>
      <option disabled selected hidden value="">
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
                    disabled={isAlreadySelected(pnc.offence.sequenceNumber)}
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
  )
}

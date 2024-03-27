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

  const onOffenceChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    amend("offenceReasonSequence")({
      offenceIndex,
      value: e.target.value
    })
  }

  const isAlreadySelected = (sequenceNumber: string) =>
    !!amendments.offenceReasonSequence?.find((x) => x.value === sequenceNumber && x.offenceIndex !== offenceIndex)

  // TODO: load manually selected value if exists (just load updated aho always?)
  // TODO: prevent matching twice
  // TODO: match dates
  return (
    <select className="govuk-select" onChange={onOffenceChanged}>
      <option disabled selected hidden></option>
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
                    disabled={isAlreadySelected(String(pnc.offence.sequenceNumber))}
                  >
                    {`${String(pnc.offence.sequenceNumber).padStart(3, "0")} - ${pnc.offence.cjsOffenceCode}`}
                  </option>
                )
              })}
          </optgroup>
        )
      })}
      <option value="added-in-court">{"Added in court"}</option>
    </select>
  )
}

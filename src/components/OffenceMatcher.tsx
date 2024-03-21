import { useCourtCase } from "context/CourtCaseContext"

export const OffenceMatcher = () => {
  const {
    aho: { PncQuery: pncQuery }
  } = useCourtCase()

  // TODO: prevent matching twice
  // TODO: match offence codes
  // TODO: match dates
  return (
    <select className="govuk-select">
      <option disabled selected hidden></option>
      {pncQuery?.courtCases?.map((c) => {
        return (
          <optgroup key={c.courtCaseReference} label={c.courtCaseReference}>
            {c.offences.map((o) => {
              return (
                <option key={o.offence.cjsOffenceCode} value={o.offence.sequenceNumber}>
                  {`${String(o.offence.sequenceNumber).padStart(3, "0")} - ${o.offence.cjsOffenceCode}`}
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

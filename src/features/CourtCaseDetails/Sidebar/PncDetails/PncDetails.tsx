import { useCourtCase } from "context/CourtCaseContext"
import {
  UpdatedDate,
  CourtCase,
  CourtCaseHeader,
  CrimeOffenceReference,
  CCR,
  Offence,
  CourtCases
} from "./PncDetails.styles"
import Disposal from "./Disposal"
import useFormattedDate from "hooks/useFormattedDate"
import PncOffenceDetails from "./PncOffenceDetails"

const PncDetails = () => {
  const {
    courtCase: {
      aho: { PncQuery: pncQuery, PncQueryDate: pncQueryDate }
    }
  } = useCourtCase()

  return (
    <>
      <UpdatedDate id="pnc-details-update-date">{`Updated ${useFormattedDate(pncQueryDate, "dd/MM/yyyy HH:mm:ss")}`}</UpdatedDate>
      <CourtCases>
        {pncQuery?.courtCases?.map((c) => (
          <CourtCase key={c.courtCaseReference}>
            <CourtCaseHeader>
              <CCR className="govuk-heading-m">{c.courtCaseReference}</CCR>
              <CrimeOffenceReference>
                <div className={"heading"}>{"Crime Offence Reference"}</div>
                <div id={"crime-offence-reference"}>{c.crimeOffenceReference || "-"}</div>
              </CrimeOffenceReference>
            </CourtCaseHeader>

            {c.offences.map(({ offence: details, adjudication, disposals }, i) => (
              <Offence key={`${i}-${details.sequenceNumber}`}>
                <PncOffenceDetails details={details} adjudication={adjudication} />
                {disposals?.map((d, j) => <Disposal key={`${j}-${d.type}`} {...d} />)}
              </Offence>
            ))}
          </CourtCase>
        ))}
      </CourtCases>
    </>
  )
}

export default PncDetails

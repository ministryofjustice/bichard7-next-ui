import { useCourtCase } from "context/CourtCaseContext"
import {
  UpdatedDate,
  CourtCase,
  CourtCaseHeader,
  CrimeOffenceReference,
  CCR,
  Offence,
  CourtCaseContainer
} from "./PncDetails.styles"
import Disposal from "./Disposal"
import useFormattedDate from "hooks/useFormattedDate"
import PncOffence from "./PncOffence"

const PncDetails = () => {
  const {
    courtCase: {
      aho: { PncQuery: pncQuery, PncQueryDate: pncQueryDate }
    }
  } = useCourtCase()

  return (
    <>
      <UpdatedDate id="pnc-details-update-date">{`Updated ${useFormattedDate(pncQueryDate, "dd/MM/yy HH:mm:ss")}`}</UpdatedDate>
      <CourtCaseContainer>
        {pncQuery?.courtCases?.map((c) => {
          return (
            <CourtCase key={c.courtCaseReference}>
              <CourtCaseHeader>
                <CCR className="govuk-heading-m">{c.courtCaseReference}</CCR>
                <CrimeOffenceReference>
                  <div className={"heading"}>{"Crime Offence Reference"}</div>
                  <div id={"crime-offence-reference"}>{c.crimeOffenceReference || "-"}</div>
                </CrimeOffenceReference>
              </CourtCaseHeader>

              {c.offences.map(({ offence: details, adjudication, disposals }) => {
                return (
                  <>
                    <Offence>
                      <PncOffence details={details} adjudication={adjudication} />
                      {disposals?.map((d, i) => <Disposal key={`${i}-${d.type}`} {...d} />)}
                    </Offence>
                  </>
                )
              })}
            </CourtCase>
          )
        })}
      </CourtCaseContainer>
    </>
  )
}

export default PncDetails

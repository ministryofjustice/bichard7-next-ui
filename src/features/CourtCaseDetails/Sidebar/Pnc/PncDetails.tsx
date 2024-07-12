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
import { formatDisplayedDate } from "utils/date/formattedDate"
import Disposal from "./Disposal"

const PncDetails = () => {
  const {
    courtCase: {
      aho: { PncQuery: pncQuery, PncQueryDate: pncQueryDate }
    }
  } = useCourtCase()

  return (
    <>
      <UpdatedDate id="pnc-details-update-date">{`Updated ${pncQueryDate?.toLocaleString().replace(",", "")}`}</UpdatedDate>
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
                      <div>
                        <div className="heading">
                          <span className="govuk-heading-m">{`${String(details.sequenceNumber).padStart(3, "0")} - ${details.cjsOffenceCode}`}</span>
                          <span className="govuk-heading-m">
                            {"ACPO"}
                            <span className="acpo-code"> {details.acpoOffenceCode}</span>
                          </span>
                        </div>
                        <div id={"offence-title"}>{details.title}</div>
                      </div>

                      <div className="details">
                        <div id={"start-date"}>
                          <b>{"Start Date"}</b>
                          <div>{formatDisplayedDate(details.startDate || "-", "dd/MM/yyyy HH:mm")}</div>
                        </div>
                        <div id={"end-date"}>
                          <b>{"End Date"}</b>
                          <div>{formatDisplayedDate(details.endDate || "-", "dd/MM/yyyy HH:mm")}</div>
                        </div>
                        <div id={"qualifier-1"}>
                          <b>{"Qualifier 1"}</b>
                          <div>{details.qualifier1 || "-"}</div>
                        </div>
                        <div id={"qualifier-2"}>
                          <b>{"Qualifier 2"}</b>
                          <div>{details.qualifier2 || "-"}</div>
                        </div>
                      </div>

                      <div className="adjudication details">
                        <div id={"adjudication"}>
                          <b>{"Adjudication"}</b>
                          <div>{adjudication?.verdict || "-"}</div>
                        </div>
                        <div id={"plea"}>
                          <b>{"Plea"}</b>
                          <div>{adjudication?.plea || "-"}</div>
                        </div>
                        <div id={"date-of-sentence"}>
                          <b>{"Date of Sentence"}</b>
                          <div>{formatDisplayedDate(adjudication?.sentenceDate ?? "-")}</div>
                        </div>
                        <div id={"tic-number"}>
                          <b>{"TIC Number"}</b>
                          <div>{adjudication?.offenceTICNumber || "-"}</div>
                        </div>
                      </div>

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

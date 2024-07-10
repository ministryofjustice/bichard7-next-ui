import { useCourtCase } from "context/CourtCaseContext"
import { UpdatedDate, CourtCase, CourtCaseHeader, CrimeOffenceReference, CCR, Offence } from "./PncDetails.styles"
import { formatDisplayedDate } from "utils/formattedDate"
import Disposal from "./Disposal"

const PncDetails = () => {
  const {
    courtCase: {
      aho: { PncQuery: pncQuery, PncQueryDate: pncQueryDate }
    }
  } = useCourtCase()

  console.log(JSON.stringify(pncQuery, null, 2))

  return (
    <>
      <UpdatedDate>{`Updated ${pncQueryDate?.toLocaleString().replace(",", "")}`}</UpdatedDate>
      {pncQuery?.courtCases?.map((c) => {
        return (
          <CourtCase key={c.courtCaseReference}>
            <CourtCaseHeader>
              <CCR className="govuk-heading-m">{c.courtCaseReference}</CCR>
              <CrimeOffenceReference>
                <div className={"heading"}>{"Crime Offence Reference"}</div>
                <div>{c.crimeOffenceReference ?? "-"}</div>
              </CrimeOffenceReference>
            </CourtCaseHeader>

            {c.offences.map(({ offence: details, adjudication, disposals }) => {
              return (
                <>
                  <Offence>
                    <div className="heading">
                      <span className="govuk-heading-s">{`${String(details.sequenceNumber).padStart(3, "0")} - ${details.cjsOffenceCode}`}</span>
                      <span className="govuk-heading-s">
                        {"ACPO"}
                        <span className="acpo-code"> {details.acpoOffenceCode}</span>
                      </span>
                    </div>
                    <div>{details.title}</div>

                    <div className="details">
                      <div>
                        <b>{"Start Date"}</b>
                        <div>{formatDisplayedDate(details.startDate, "dd/MM/yyyy HH:mm")}</div>
                      </div>
                      <div>
                        <b>{"End Date"}</b>
                        <div>{formatDisplayedDate(details.endDate ?? "-", "dd/MM/yyyy HH:mm")}</div>
                      </div>
                      <div>
                        <b>{"Qualifier 1"}</b>
                        <div>{details.qualifier1 || "-"}</div>
                      </div>
                      <div>
                        <b>{"Qualifier 2"}</b>
                        <div>{details.qualifier2 || "-"}</div>
                      </div>
                    </div>

                    <div className="adjudication details">
                      <div>
                        <b>{"Adjudication"}</b>
                        <div>{adjudication?.verdict || "-"}</div>
                      </div>
                      <div>
                        <b>{"Plea"}</b>
                        <div>{adjudication?.plea || "-"}</div>
                      </div>
                      <div>
                        <b>{"Date of Sentence"}</b>
                        <div>{formatDisplayedDate(adjudication?.sentenceDate ?? "-")}</div>
                      </div>
                      <div>
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
    </>
  )
}

export default PncDetails

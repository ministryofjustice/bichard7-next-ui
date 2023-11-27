import { useCourtCaseContext } from "context/CourtCaseContext"
import { createUseStyles } from "react-jss"
import { gdsLightGrey } from "utils/colours"
import { formatDisplayedDate } from "utils/formattedDate"

interface CourtCaseDetailsSummaryBoxFieldProps {
  label: string
  value: string | null | undefined
}

const CourtCaseDetailsSummaryBoxField = ({ label, value }: CourtCaseDetailsSummaryBoxFieldProps) => (
  <>
    <div>
      <b className="govuk-!-static-padding-right-3">{label}</b>
    </div>
    <div>{value}</div>
  </>
)

const useStyles = createUseStyles({
  "court-case-details-summary-box": {
    display: "grid",
    gridTemplateColumns: "repeat(3, max-content auto)",
    backgroundColor: gdsLightGrey,
    rowGap: "12px",
    padding: "30px",
    "& div": {
      fontSize: "19px",
      lineHeight: "25px"
    }
  }
})

interface CourtCaseDetailsSummaryBoxProps {
  courtHouseCode: string | null
  pnci: string | undefined
  dob: string | undefined
  hearingDate: string | undefined
}

const CourtCaseDetailsSummaryBox = ({ courtHouseCode, pnci, dob, hearingDate }: CourtCaseDetailsSummaryBoxProps) => {
  const classes = useStyles()
  const courtCase = useCourtCaseContext().courtCase

  return (
    <div className={`${classes["court-case-details-summary-box"]} govuk-body`}>
      <CourtCaseDetailsSummaryBoxField label="PTIURN" value={courtCase.ptiurn} />
      <CourtCaseDetailsSummaryBoxField label="ASN" value={courtCase.asn} />
      <CourtCaseDetailsSummaryBoxField label="PNCID" value={pnci} />
      <CourtCaseDetailsSummaryBoxField label="DOB" value={formatDisplayedDate(dob || "")} />
      <CourtCaseDetailsSummaryBoxField label="Hearing date" value={formatDisplayedDate(hearingDate || "")} />
      <CourtCaseDetailsSummaryBoxField label="Court code (LJA)" value={courtHouseCode} />
      <CourtCaseDetailsSummaryBoxField label="Court case reference" value={courtCase.courtReference} />
      <CourtCaseDetailsSummaryBoxField label="Court name" value={courtCase.courtName} />
    </div>
  )
}

export default CourtCaseDetailsSummaryBox

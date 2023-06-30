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
  asn: string | null
  courtCode: string | null
  courtName: string
  courtReference: string
  pnci: string | undefined
  ptiurn: string
  dob: string | undefined
  hearingDate: string | undefined
}

const CourtCaseDetailsSummaryBox = ({
  asn,
  courtCode,
  courtName,
  courtReference,
  pnci,
  ptiurn,
  dob,
  hearingDate
}: CourtCaseDetailsSummaryBoxProps) => {
  const classes = useStyles()

  return (
    <div className={`${classes["court-case-details-summary-box"]} govuk-body`}>
      <CourtCaseDetailsSummaryBoxField label="PTIURN" value={ptiurn} />
      <CourtCaseDetailsSummaryBoxField label="ASN" value={asn} />
      <CourtCaseDetailsSummaryBoxField label="PNCID" value={pnci} />
      <CourtCaseDetailsSummaryBoxField label="DOB" value={formatDisplayedDate(dob || "")} />
      <CourtCaseDetailsSummaryBoxField label="Hearing date" value={formatDisplayedDate(hearingDate || "")} />
      <CourtCaseDetailsSummaryBoxField label="Court code (LJA)" value={courtCode} />
      <CourtCaseDetailsSummaryBoxField label="Court case reference" value={courtReference} />
      <CourtCaseDetailsSummaryBoxField label="Court name" value={courtName} />
    </div>
  )
}

export default CourtCaseDetailsSummaryBox

import { createUseStyles } from "react-jss"
import { gdsLightGrey } from "utils/colours"

interface CourtCaseDetailsSummaryBoxFieldProps {
  label: string
  value: string | null | undefined
}

const CourtCaseDetailsSummaryBoxField = ({ label, value }: CourtCaseDetailsSummaryBoxFieldProps) => (
  <div>
    <b className="govuk-!-static-padding-right-3">{label}</b> {value}
  </div>
)

const useStyles = createUseStyles({
  "court-case-details-summary-box": {
    display: "grid",
    gridTemplateColumns: "auto auto auto",
    backgroundColor: gdsLightGrey,
    padding: "20px 0",
    margin: "34px 0",
    "& div": {
      padding: "10px",
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
}

const CourtCaseDetailsSummaryBox = ({
  asn,
  courtCode,
  courtName,
  courtReference,
  pnci,
  ptiurn
}: CourtCaseDetailsSummaryBoxProps) => {
  const classes = useStyles()

  return (
    <div className={`${classes["court-case-details-summary-box"]} govuk-body`}>
      <CourtCaseDetailsSummaryBoxField label="PTIURN" value={ptiurn} />
      <CourtCaseDetailsSummaryBoxField label="ASN" value={asn} />
      <CourtCaseDetailsSummaryBoxField label="PNCID" value={pnci} />
      <CourtCaseDetailsSummaryBoxField label="Court name" value={courtName} />
      <CourtCaseDetailsSummaryBoxField label="Court code (LJA)" value={courtCode} />
      <CourtCaseDetailsSummaryBoxField label="Court case reference" value={courtReference} />
    </div>
  )
}

export default CourtCaseDetailsSummaryBox

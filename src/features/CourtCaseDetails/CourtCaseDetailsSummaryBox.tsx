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

const CourtCaseDetailsSummaryBox = () => {
  const classes = useStyles()
  const courtCase = useCourtCaseContext().courtCase

  const formattedHearingDate = formatDisplayedDate(
    courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing.toString() || ""
  )
  const formattedDobDate = formatDisplayedDate(
    courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.BirthDate?.toString() ||
      ""
  )
  const pnci = courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCIdentifier

  return (
    <div className={`${classes["court-case-details-summary-box"]} govuk-body`}>
      <CourtCaseDetailsSummaryBoxField label="PTIURN" value={courtCase.ptiurn} />
      <CourtCaseDetailsSummaryBoxField label="ASN" value={courtCase.asn} />
      <CourtCaseDetailsSummaryBoxField label="PNCID" value={pnci} />
      <CourtCaseDetailsSummaryBoxField label="DOB" value={formattedDobDate} />
      <CourtCaseDetailsSummaryBoxField label="Hearing date" value={formattedHearingDate} />
      <CourtCaseDetailsSummaryBoxField
        label="Court code (LJA)"
        value={courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHouseCode.toString()}
      />
      <CourtCaseDetailsSummaryBoxField label="Court case reference" value={courtCase.courtReference} />
      <CourtCaseDetailsSummaryBoxField label="Court name" value={courtCase.courtName} />
    </div>
  )
}

export default CourtCaseDetailsSummaryBox

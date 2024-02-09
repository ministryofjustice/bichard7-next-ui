import { useCourtCase } from "context/CourtCaseContext"
import { createUseStyles } from "react-jss"
import { gdsLightGrey } from "utils/colours"
import { formatDisplayedDate } from "utils/formattedDate"

interface CourtCaseDetailsSummaryBoxFieldProps {
  label: string
  value: string | null | undefined
  courtNameClass?: string
}

const useStyles = createUseStyles({
  "court-case-details-summary-box": {
    backgroundColor: gdsLightGrey,
    padding: "25px"
  },
  "court-case-details-summary-box-grid": {
    display: "grid",
    gridTemplateColumns: "repeat(3, auto)",
    gridAutoFlow: "row dense",
    rowGap: "12px"
  },
  detail: {},
  "detail__court-name-inside": {
    display: "none",
    visibility: "hidden"
  },
  "detail__court-name-outside": {
    display: "inline-block",
    visibility: "visible",
    marginTop: "12px"
  },
  detail__label: {
    display: "inline-block",
    marginRight: "10px"
  },
  detail__value: {
    display: "inline-block",
    marginRight: "15px"
  },
  "@media (min-width: 1280px) and (max-width: 1680px)": {
    detail__label: {
      width: "180px"
    }
  },
  "@media (min-width: 1680px)": {
    "court-case-details-summary-box-grid": {
      display: "flex"
    },
    detail: {
      display: "block",
      paddingRight: "35px",
      "&:last-child": {
        paddingRight: 0
      }
    },
    "detail__court-name-inside": {
      display: "block",
      visibility: "visible"
    },
    "detail__court-name-outside": {
      display: "none",
      visibility: "hidden"
    },
    detail__label: {
      display: "flex",
      minWidth: "inherit"
    },
    detail__value: {
      display: "flex",
      marginRight: 0,
      marginLeft: 0
    }
  }
})

const CourtCaseDetailsSummaryBoxField = ({
  label,
  value,
  courtNameClass = undefined
}: CourtCaseDetailsSummaryBoxFieldProps) => {
  const classes = useStyles()
  const classNames = [classes.detail]

  if (courtNameClass) {
    if (courtNameClass === "inside") {
      classNames.push(classes["detail__court-name-inside"])
    } else if (courtNameClass === "outside") {
      classNames.push(classes["detail__court-name-outside"])
    }
  }

  return (
    <div className={classNames.join(" ")}>
      <div className={classes.detail__label}>
        <b>{label}</b>
      </div>
      <div className={classes.detail__value}>{value}</div>
    </div>
  )
}

const CourtCaseDetailsSummaryBox = () => {
  const classes = useStyles()
  const courtCase = useCourtCase()

  const formattedHearingDate = formatDisplayedDate(
    courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing.toString() || ""
  )
  const formattedDobDate = formatDisplayedDate(
    courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.BirthDate?.toString() ??
      ""
  )
  const pnci = courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCIdentifier
  const asn = courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber

  return (
    <div className={`${classes["court-case-details-summary-box"]} govuk-body`}>
      <div className={`${classes["court-case-details-summary-box-grid"]}`}>
        <CourtCaseDetailsSummaryBoxField label="PTIURN" value={courtCase.ptiurn} />
        <CourtCaseDetailsSummaryBoxField label="ASN" value={asn} />
        <CourtCaseDetailsSummaryBoxField label="PNCID" value={pnci} />
        <CourtCaseDetailsSummaryBoxField label="DOB" value={formattedDobDate} />
        <CourtCaseDetailsSummaryBoxField label="Hearing date" value={formattedHearingDate} />
        <CourtCaseDetailsSummaryBoxField
          label="Court code (LJA)"
          value={courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHouseCode.toString()}
        />
        <CourtCaseDetailsSummaryBoxField label="Court name" value={courtCase.courtName} courtNameClass={"inside"} />
      </div>
      <CourtCaseDetailsSummaryBoxField label="Court name" value={courtCase.courtName} courtNameClass={"outside"} />
    </div>
  )
}

export default CourtCaseDetailsSummaryBox

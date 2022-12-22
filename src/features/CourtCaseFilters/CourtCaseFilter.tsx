/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import CourtCaseTypeOptions from "components/CourtDateFilter/CourtCaseTypeOptions"
import UrgencyFilterOptions from "components/CourtDateFilter/UrgencyFilterOptions"
import If from "components/If"
import LockedFilterOptions from "components/LockedFilter/LockedFilterOptions"
import { HintText } from "govuk-react"
import { ReactNode, useState } from "react"
import { createUseStyles } from "react-jss"
import { Reason } from "types/CaseListQueryParams"
import CourtDateFilterOptions from "../../components/CourtDateFilter/CourtDateFilterOptions"

interface Props {
  courtCaseTypes?: Reason[]
  dateRange?: string | null
  urgency?: string | null
  locked?: string | null
}
const useStyles = createUseStyles({
  legendColour: {
    color: "#1D70B8"
  },
  legendContainer: {
    marginTop: "8px"
  },
  iconButton: {
    padding: "5px 10px",
    margin: "0 2px 0 -10px",
    border: "3px solid transparent",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "#b0b4b6"
    },
    "&:active": {
      backgroundColor: "#b0b4b6",
      borderColor: "#ffe304"
    }
  },
  iconContainer: {
    margin: "5px 0"
  },
  container: {
    display: "flex",
    margin: "0 0 0 0"
  },
  "govuk-form-group": {
    marginBottom: "0"
  }
})

const UpArrow: React.FC = () => (
  <svg width={18} height={10} viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.999926 9.28432L8.74976 1.56866L16.4996 9.28432" stroke="#0B0C0C" strokeWidth={2} />
  </svg>
)

const DownArrow: React.FC = () => (
  <svg width={18} height={11} viewBox="0 0 18 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.9994 1.26702L9.26685 9L1.49977 1.30171" stroke="#0B0C0C" strokeWidth={2} />
  </svg>
)

const ExpandingFilters: React.FC<{ filterName: string; children: ReactNode }> = ({
  filterName,
  children
}: {
  filterName: string
  children: ReactNode
}) => {
  const [caseTypeIsVisible, setCaseTypeVisible] = useState(true)
  const classes = useStyles()
  return (
    <fieldset className="govuk-fieldset">
      <div className={classes.container}>
        <div
          className={classes.iconContainer}
          onClick={() => {
            setCaseTypeVisible(!caseTypeIsVisible)
          }}
        >
          <button type="button" className={classes.iconButton} aria-label={filterName}>
            {caseTypeIsVisible ? <UpArrow /> : <DownArrow />}
          </button>
        </div>
        <div className={classes.legendContainer}>
          <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
            <div className={classes.legendColour}>{`${filterName} filter options`}</div>
          </legend>
        </div>
      </div>
      <If condition={caseTypeIsVisible}>{children}</If>
    </fieldset>
  )
}

const CourtCaseFilter: React.FC<Props> = ({ courtCaseTypes, dateRange, urgency, locked }: Props) => {
  const classes = useStyles()
  return (
    <form method={"get"}>
      <div className="moj-filter__header">
        <div className="moj-filter__header-title">
          <h2 className="govuk-heading-m">{"Filter"}</h2>
        </div>
        <div className="moj-filter__header-action"></div>
      </div>
      <div className="moj-filter__content">
        <div className="moj-filter__selected">
          <div className="moj-filter__selected-heading">
            <div className="moj-filter__heading-title">
              <h2 className="govuk-heading-m">{"Selected filters"}</h2>
            </div>
          </div>
        </div>
        <div className="moj-filter__options">
          <button className="govuk-button" data-module="govuk-button" id="search">
            {"Apply filters"}
          </button>
          <div className={classes["govuk-form-group"]}>
            <label className="govuk-label govuk-label--m" htmlFor="keywords">
              {"Keywords"}
            </label>
            <HintText>{"Defendent name, Court name, Reason, PTIURN"}</HintText>
            <input className="govuk-input" id="keywords" name="keywords" type="text"></input>
          </div>
          <div className={classes["govuk-form-group"]}>
            <hr className="govuk-section-break govuk-section-break--m govuk-section-break govuk-section-break--visible" />
            <ExpandingFilters filterName={"Case type"}>
              <CourtCaseTypeOptions courtCaseTypes={courtCaseTypes} />
            </ExpandingFilters>
          </div>
          <div className={classes["govuk-form-group"]}>
            <hr className="govuk-section-break govuk-section-break--m govuk-section-break govuk-section-break--visible" />
            <ExpandingFilters filterName={"Court date"}>
              <CourtDateFilterOptions dateRange={dateRange} />
            </ExpandingFilters>
          </div>
          <div className={classes["govuk-form-group"]}>
            <hr className="govuk-section-break govuk-section-break--m govuk-section-break govuk-section-break--visible" />
            <ExpandingFilters filterName={"Urgency"}>
              <UrgencyFilterOptions urgency={urgency} />
            </ExpandingFilters>
          </div>
          <div>
            <hr className="govuk-section-break govuk-section-break--m govuk-section-break govuk-section-break--visible" />
            <ExpandingFilters filterName={"Locked state"}>
              <LockedFilterOptions locked={locked} />
            </ExpandingFilters>
          </div>
        </div>
      </div>
    </form>
  )
}

export default CourtCaseFilter

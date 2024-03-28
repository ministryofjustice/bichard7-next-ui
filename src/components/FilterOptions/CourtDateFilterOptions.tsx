import DateInput from "components/CustomDateInput/DateInput"
import RadioButton from "components/RadioButton/RadioButton"
import type { Dispatch } from "react"
import { createUseStyles } from "react-jss"
import { SerializedCourtDateRange } from "types/CaseListQueryParams"
import type { FilterAction } from "types/CourtCaseFilter"
import { CaseAgeOptions } from "utils/caseAgeOptions"
import { formatDisplayedDate } from "utils/formattedDate"
import { mapCaseAges } from "utils/validators/validateCaseAges"

interface Props {
  caseAges?: string[]
  caseAgeCounts: Record<string, number>
  dispatch: Dispatch<FilterAction>
  dateRange: SerializedCourtDateRange | undefined
}

const useStyles = createUseStyles({
  "scrollable-case-ages": {
    height: "180px",
    overflow: "auto"
  },
  "case-age-option": {
    padding: "0 0 0 10px"
  }
})

const getCaseAgeWithFormattedDate = (namedCaseAge: string): string => {
  const caseAge = mapCaseAges(namedCaseAge)
  if (caseAge.length === 0) {
    return namedCaseAge
  }

  const dateRange = [caseAge].flat()[0]

  return namedCaseAge === "15 days ago and older"
    ? `15 days ago and older (up to ${formatDisplayedDate(dateRange.to)})`
    : `${namedCaseAge} (${formatDisplayedDate(dateRange.from)})`
}

const labelForCaseAge = (namedCaseAge: string, caseAgeCounts: Record<string, number>): string => {
  const caseCount = `(${caseAgeCounts[namedCaseAge as string]})`

  return ["Today", "Yesterday"].includes(namedCaseAge)
    ? `${namedCaseAge} ${caseCount}`
    : `${getCaseAgeWithFormattedDate(namedCaseAge)} ${caseCount}`
}

const caseAgeId = (caseAge: string): string => `case-age-${caseAge.toLowerCase().replace(/ /g, "-")}`

const CourtDateFilterOptions: React.FC<Props> = ({ caseAges, caseAgeCounts, dispatch, dateRange }: Props) => {
  const classes = useStyles()

  return (
    <fieldset className="govuk-fieldset">
      <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
        <RadioButton
          name={"courtDate"}
          id={"date-range"}
          dataAriaControls={"conditional-date-range"}
          defaultChecked={!!dateRange?.from && !!dateRange.to}
          label={"Date range"}
          onChange={(event) => dispatch({ method: "remove", type: "caseAge", value: event.target.value as string })}
        />
        <div className="govuk-radios__conditional" id="conditional-date-range">
          <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
            <DateInput dateType="from" dispatch={dispatch} value={dateRange?.from ?? ""} dateRange={dateRange} />
            <DateInput dateType="to" dispatch={dispatch} value={dateRange?.to ?? ""} dateRange={dateRange} />
          </div>
        </div>
        <RadioButton
          name={"courtDate"}
          id={"case-age"}
          dataAriaControls={"conditional-case-age"}
          defaultChecked={caseAges && caseAges.length > 0 ? true : false}
          label={"Case Recieved"}
        />
        <div className="govuk-radios__conditional" id="conditional-case-age">
          <div className={classes["scrollable-case-ages"]}>
            <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
              {Object.keys(CaseAgeOptions).map((namedCaseAge) => (
                <div className={classes["case-age-option"]} key={namedCaseAge}>
                  <div className="govuk-checkboxes__item">
                    <input
                      className="govuk-checkboxes__input"
                      id={caseAgeId(namedCaseAge)}
                      name="caseAge"
                      type="checkbox"
                      value={namedCaseAge}
                      checked={caseAges?.includes(namedCaseAge as string)}
                      onChange={(event) => {
                        dispatch({
                          method: "remove",
                          type: "dateRange",
                          value: `${dateRange?.from} - ${dateRange?.to}`
                        })

                        const value = event.currentTarget.value as string
                        dispatch({ method: event.currentTarget.checked ? "add" : "remove", type: "caseAge", value })
                      }}
                    ></input>
                    <label className="govuk-label govuk-checkboxes__label" htmlFor={caseAgeId(namedCaseAge)}>
                      {labelForCaseAge(namedCaseAge, caseAgeCounts)}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </fieldset>
  )
}
export default CourtDateFilterOptions

import { format } from "date-fns"
import { NamedDateRangeOptions } from "utils/namedDateRange"
import { mapDateRanges } from "utils/validators/validateDateRanges"
import RadioButton from "components/RadioButton/RadioButton"
import type { FilterAction } from "types/CourtCaseFilter"
import type { Dispatch } from "react"
import DateInput from "components/CustomDateInput/DateInput"
import { NamedCourtDateRange } from "types/CaseListQueryParams"
import getCustomDateRangeLabel from "utils/getCustomDateRangeLabel"
import { CountOfCasesByCaseAgeResult } from "types/CountOfCasesByCaseAgeResult"
import { displayedDateFormat } from "utils/formattedDate"

interface Props {
  dateRange?: NamedCourtDateRange[]
  caseAgeCounts: CountOfCasesByCaseAgeResult
  dispatch: Dispatch<FilterAction>
  customDateFrom: Date | undefined
  customDateTo: Date | undefined
}

const getCaseAgeWithFormattedDate = (namedDateRange: string): string => {
  const dateRange = mapDateRanges(namedDateRange)
  return dateRange ? `${namedDateRange} (${format([dateRange].flat()[0].from, displayedDateFormat)})` : namedDateRange
}

const labelForCaseAge = (namedDateRange: string, caseAgeCounts: CountOfCasesByCaseAgeResult): string => {
  const caseCount = `(${caseAgeCounts[namedDateRange as NamedCourtDateRange]})`

  return ["Today", "Yesterday"].includes(namedDateRange)
    ? `${namedDateRange} ${caseCount}`
    : `${getCaseAgeWithFormattedDate(namedDateRange)} ${caseCount}`
}

const caseAgeId = (caseAge: string): string => `date-range-${caseAge.toLowerCase().replace(" ", "-")}`

const CourtDateFilterOptions: React.FC<Props> = ({
  dateRange,
  caseAgeCounts,
  dispatch,
  customDateFrom,
  customDateTo
}: Props) => {
  const hasCustomDateRange = !!customDateFrom && !!customDateTo
  const defaultDateValue = (date?: Date | null): string => {
    if (!!date) {
      return format(date, "yyyy-MM-dd")
    }
    return ""
  }

  return (
    <fieldset className="govuk-fieldset">
      <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
        <RadioButton
          name={"courtDate"}
          id={"custom-date-range"}
          dataAriaControls={"conditional-custom-date-range"}
          defaultChecked={hasCustomDateRange}
          label={"Date range"}
          onChange={(event) => dispatch({ method: "remove", type: "date", value: event.target.value })}
        />
        <div className="govuk-radios__conditional" id="conditional-custom-date-range">
          <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
            <DateInput dateType="from" dispatch={dispatch} value={defaultDateValue(customDateFrom)} />
            <DateInput dateType="to" dispatch={dispatch} value={defaultDateValue(customDateTo)} />
          </div>
        </div>
        <RadioButton
          name={"courtDate"}
          id={"date-range"}
          dataAriaControls={"conditional-date-range"}
          defaultChecked={dateRange && dateRange.length > 0 ? true : false}
          label={"Case age (SLA)"}
        />
        <div className="govuk-radios__conditional" id="conditional-date-range">
          <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
            {Object.keys(NamedDateRangeOptions).map((namedDateRange) => (
              <div className="govuk-checkboxes__item" key={namedDateRange}>
                <input
                  className="govuk-checkboxes__input"
                  id={caseAgeId(namedDateRange)}
                  name="dateRange"
                  type="checkbox"
                  value={namedDateRange}
                  checked={dateRange?.includes(namedDateRange as NamedCourtDateRange)}
                  onChange={(event) => {
                    dispatch({
                      method: "remove",
                      type: "customDate",
                      value: getCustomDateRangeLabel(customDateFrom, customDateTo)
                    })

                    const value = event.currentTarget.value
                    dispatch({ method: event.currentTarget.checked ? "add" : "remove", type: "date", value })
                  }}
                ></input>
                <label className="govuk-label govuk-checkboxes__label" htmlFor={caseAgeId(namedDateRange)}>
                  {labelForCaseAge(namedDateRange, caseAgeCounts)}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </fieldset>
  )
}
export default CourtDateFilterOptions

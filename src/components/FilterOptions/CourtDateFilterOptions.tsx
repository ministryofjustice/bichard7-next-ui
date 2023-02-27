import { format } from "date-fns"
import { mapDateRange, validateNamedDateRange } from "utils/validators/validateDateRanges"
import { NamedDateRangeOptions } from "utils/namedDateRange"
import RadioButton from "components/RadioButton/RadioButton"
import type { FilterAction } from "types/CourtCaseFilter"
import type { Dispatch } from "react"
import DateInput from "components/CustomDateInput/DateInput"
import { displayedDateFormat } from "utils/formattedDate"

interface Props {
  dateRange?: string | null
  dispatch: Dispatch<FilterAction>
  customDateFrom: Date | null
  customDateTo: Date | null
}

const formatNamedDateRange = (namedDateRange: string): string => {
  const dateRange = mapDateRange(namedDateRange)
  return dateRange
    ? `${namedDateRange} (${format(dateRange.from, displayedDateFormat)} - ${format(
        dateRange.to,
        displayedDateFormat
      )})`
    : namedDateRange
}

const labelForDateRange = (namedDateRange: string): string =>
  ["Today", "Yesterday"].includes(namedDateRange) ? namedDateRange : formatNamedDateRange(namedDateRange)

// TODO- update radio button logic for nested radios. Move away from GOV UK condition classes and use "states" instead.
const CourtDateFilterOptions: React.FC<Props> = ({ dateRange, dispatch, customDateFrom, customDateTo }: Props) => {
  const hasCustomDateRange = !!customDateFrom && !!customDateTo
  const defaultDateValue = (date?: Date | null): string => {
    if (!!date) {
      return format(date, "yyyy-MM-dd")
    }
    return ""
  }

  const customDateRangeLabel = hasCustomDateRange
    ? `${format(customDateFrom, displayedDateFormat)} - ${format(customDateTo, displayedDateFormat)}`
    : ""

  return (
    <fieldset className="govuk-fieldset">
      <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
        <RadioButton
          name={"courtDate"}
          id={"date-range"}
          dataAriaControls={"conditional-date-range"}
          defaultChecked={validateNamedDateRange(dateRange || "")}
          label={"Date range"}
        />
        <div className="govuk-radios__conditional" id="conditional-date-range">
          <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
            {Object.keys(NamedDateRangeOptions).map((namedDateRange) => (
              <RadioButton
                name={"dateRange"}
                key={namedDateRange.toLowerCase().replace(" ", "-")}
                id={`date-range-${namedDateRange.toLowerCase().replace(" ", "-")}`}
                checked={dateRange === namedDateRange}
                value={namedDateRange}
                label={labelForDateRange(namedDateRange)}
                onChange={(event) => {
                  dispatch({ method: "remove", type: "customDate", value: customDateRangeLabel })
                  dispatch({ method: "add", type: "date", value: event.target.value })
                }}
              />
            ))}
          </div>
        </div>
        <RadioButton
          name={"courtDate"}
          id={"custom-date-range"}
          dataAriaControls={"conditional-custom-date-range"}
          defaultChecked={hasCustomDateRange}
          label={"Custom date range"}
          onChange={(event) => dispatch({ method: "remove", type: "date", value: event.target.value })}
        />
        <div className="govuk-radios__conditional" id="conditional-custom-date-range">
          <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
            <DateInput dateType="from" dispatch={dispatch} defaultValue={defaultDateValue(customDateFrom)} />
            <DateInput dateType="to" dispatch={dispatch} defaultValue={defaultDateValue(customDateTo)} />
          </div>
        </div>
      </div>
    </fieldset>
  )
}
export default CourtDateFilterOptions

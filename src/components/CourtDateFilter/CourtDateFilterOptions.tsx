import { format } from "date-fns"
import { mapDateRange, validateNamedDateRange } from "utils/validators/validateDateRanges"
import { NamedDateRangeOptions } from "utils/namedDateRange"
import RadioButton from "components/RadioButton/RadioButton"
import type { FilterAction } from "types/CourtCaseFilter"
import type { Dispatch } from "react"
import DateInput from "components/CustomDateInput/DateInput"

interface Props {
  dateRange?: string | null
  dispatch: Dispatch<FilterAction>
}

const formatNamedDateRange = (namedDateRange: string): string => {
  const dateRange = mapDateRange(namedDateRange)
  return dateRange
    ? `${namedDateRange} (${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")})`
    : namedDateRange
}

const labelForDateRange = (namedDateRange: string): string =>
  ["Today", "Yesterday"].includes(namedDateRange) ? namedDateRange : formatNamedDateRange(namedDateRange)

const CourtDateFilterOptions: React.FC<Props> = ({ dateRange, dispatch }: Props) => {
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
                onChange={(event) => dispatch({ method: "add", type: "date", value: event.target.value })}
              />
            ))}
          </div>
        </div>
        <RadioButton
          name={"courtDate"}
          id={"custom-date-range"}
          dataAriaControls={"conditional-custom-date-range"}
          defaultChecked={validateNamedDateRange(dateRange || "")}
          label={"Custom Date range"}
        />
        <div className="govuk-radios__conditional" id="conditional-custom-date-range">
          <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
            <DateInput />
            {/* <div className="govuk-radios__item">
              <input
                className="govuk-radios__input"
                id="conditional-custom-date-range"
                name="courtDate"
                type="radio"
                value=""
              />
              <label className="govuk-label govuk-radios__label" htmlFor="conditional-custom-date-range">
                {"Custom date range"}
              </label>
            </div> */}
          </div>
        </div>
      </div>
    </fieldset>
  )
}

export default CourtDateFilterOptions

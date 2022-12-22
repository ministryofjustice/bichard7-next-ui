import { format } from "date-fns"
import { mapDateRange, validateNamedDateRange } from "utils/validators/validateDateRanges"
import { NamedDateRangeOptions } from "utils/namedDateRange"
import RadioButton from "components/RadioButton/RadioButton"

interface Props {
  dateRange?: string | null
}

const formatNamedDateRange = (namedDateRange: string): string => {
  const dateRange = mapDateRange(namedDateRange)
  return dateRange
    ? `${namedDateRange} (${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")})`
    : namedDateRange
}

const labelForDateRange = (namedDateRange: string): string =>
  ["Today", "Yesterday"].includes(namedDateRange) ? namedDateRange : formatNamedDateRange(namedDateRange)

const CourtDateFilterOptions: React.FC<Props> = ({ dateRange }: Props) => (
  <>
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
              defaultChecked={dateRange === namedDateRange}
              value={namedDateRange}
              label={labelForDateRange(namedDateRange)}
            />
          ))}
        </div>
      </div>
      <div className="govuk-radios__item">
        <input className="govuk-radios__input" id="custom-date-range" name="courtDate" type="radio" value="" />
        <label className="govuk-label govuk-radios__label" htmlFor="custom-date-range">
          {"Custom date range"}
        </label>
      </div>
    </div>
  </>
)

export default CourtDateFilterOptions

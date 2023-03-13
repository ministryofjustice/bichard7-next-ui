import { format, parse } from "date-fns"
import { CaseAgeOptions } from "utils/caseAgeOptions"
import { mapCaseAges } from "utils/validators/validateCaseAges"
import RadioButton from "components/RadioButton/RadioButton"
import type { FilterAction } from "types/CourtCaseFilter"
import type { Dispatch } from "react"
import DateInput from "components/CustomDateInput/DateInput"
import { CaseAge, SerializedCourtDateRange } from "types/CaseListQueryParams"
import { CountOfCasesByCaseAgeResult } from "types/CountOfCasesByCaseAgeResult"
import { formatDisplayedDate } from "utils/formattedDate"

interface Props {
  caseAge?: CaseAge[]
  caseAgeCounts: CountOfCasesByCaseAgeResult
  dispatch: Dispatch<FilterAction>
  dateRange: SerializedCourtDateRange | undefined
}

const getCaseAgeWithFormattedDate = (namedCaseAge: string): string => {
  const caseAge = mapCaseAges(namedCaseAge)
  return caseAge ? `${namedCaseAge} (${formatDisplayedDate([caseAge].flat()[0].from)})` : namedCaseAge
}

const labelForCaseAge = (namedCaseAge: string, caseAgeCounts: CountOfCasesByCaseAgeResult): string => {
  const caseCount = `(${caseAgeCounts[namedCaseAge as CaseAge]})`

  return ["Today", "Yesterday"].includes(namedCaseAge)
    ? `${namedCaseAge} ${caseCount}`
    : `${getCaseAgeWithFormattedDate(namedCaseAge)} ${caseCount}`
}

const caseAgeId = (caseAge: string): string => `case-age-${caseAge.toLowerCase().replace(" ", "-")}`

const CourtDateFilterOptions: React.FC<Props> = ({ caseAge, caseAgeCounts, dispatch, dateRange }: Props) => {
  const defaultDateValue = (dateString?: string | null): string =>
    !!dateString ? format(parse(dateString, "dd/MM/yyyy", new Date()), "yyyy-MM-dd") : ""

  return (
    <fieldset className="govuk-fieldset">
      <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
        <RadioButton
          name={"courtDate"}
          id={"date-range"}
          dataAriaControls={"conditional-date-range"}
          defaultChecked={!!dateRange}
          label={"Date range"}
          onChange={(event) => dispatch({ method: "remove", type: "caseAge", value: event.target.value as CaseAge })}
        />
        <div className="govuk-radios__conditional" id="conditional-date-range">
          <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
            <DateInput dateType="from" dispatch={dispatch} value={defaultDateValue(dateRange?.from)} />
            <DateInput dateType="to" dispatch={dispatch} value={defaultDateValue(dateRange?.to)} />
          </div>
        </div>
        <RadioButton
          name={"courtDate"}
          id={"case-age"}
          dataAriaControls={"conditional-case-age"}
          defaultChecked={caseAge && caseAge.length > 0 ? true : false}
          label={"Case age (SLA)"}
        />
        <div className="govuk-radios__conditional" id="conditional-case-age">
          <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
            {Object.keys(CaseAgeOptions).map((namedCaseAge) => (
              <div className="govuk-checkboxes__item" key={namedCaseAge}>
                <input
                  className="govuk-checkboxes__input"
                  id={caseAgeId(namedCaseAge)}
                  name="caseAge"
                  type="checkbox"
                  value={namedCaseAge}
                  checked={caseAge?.includes(namedCaseAge as CaseAge)}
                  onChange={(event) => {
                    dispatch({
                      method: "remove",
                      type: "dateRange",
                      value: `${dateRange?.from} - ${dateRange?.to}`
                    })

                    const value = event.currentTarget.value as CaseAge
                    dispatch({ method: event.currentTarget.checked ? "add" : "remove", type: "caseAge", value })
                  }}
                ></input>
                <label className="govuk-label govuk-checkboxes__label" htmlFor={caseAgeId(namedCaseAge)}>
                  {labelForCaseAge(namedCaseAge, caseAgeCounts)}
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

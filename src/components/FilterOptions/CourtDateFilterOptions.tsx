import { format } from "date-fns"
import { CaseAgeOptions } from "utils/caseAgeOptions"
import { mapCaseAges } from "utils/validators/validateCaseAges"
import RadioButton from "components/RadioButton/RadioButton"
import type { FilterAction } from "types/CourtCaseFilter"
import type { Dispatch } from "react"
import DateInput from "components/CustomDateInput/DateInput"
import { CaseAge } from "types/CaseListQueryParams"
import getDateRangeLabel from "utils/getDateRangeLabel"
import { CountOfCasesByCaseAgeResult } from "types/CountOfCasesByCaseAgeResult"
import { displayedDateFormat } from "utils/formattedDate"

interface Props {
  caseAge?: CaseAge[]
  caseAgeCounts: CountOfCasesByCaseAgeResult
  dispatch: Dispatch<FilterAction>
  dateFrom: Date | undefined
  dateTo: Date | undefined
}

const getCaseAgeWithFormattedDate = (namedCaseAge: string): string => {
  const caseAge = mapCaseAges(namedCaseAge)
  return caseAge ? `${namedCaseAge} (${format([caseAge].flat()[0].from, displayedDateFormat)})` : namedCaseAge
}

const labelForCaseAge = (namedCaseAge: string, caseAgeCounts: CountOfCasesByCaseAgeResult): string => {
  const caseCount = `(${caseAgeCounts[namedCaseAge as CaseAge]})`

  return ["Today", "Yesterday"].includes(namedCaseAge)
    ? `${namedCaseAge} ${caseCount}`
    : `${getCaseAgeWithFormattedDate(namedCaseAge)} ${caseCount}`
}

const caseAgeId = (caseAge: string): string => `case-age-${caseAge.toLowerCase().replace(" ", "-")}`

const CourtDateFilterOptions: React.FC<Props> = ({ caseAge, caseAgeCounts, dispatch, dateFrom, dateTo }: Props) => {
  const hasDateRange = !!dateFrom && !!dateTo
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
          id={"date-range"}
          dataAriaControls={"conditional-date-range"}
          defaultChecked={hasDateRange}
          label={"Date range"}
          onChange={(event) => dispatch({ method: "remove", type: "caseAge", value: event.target.value as CaseAge })}
        />
        <div className="govuk-radios__conditional" id="conditional-date-range">
          <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
            <DateInput dateType="from" dispatch={dispatch} value={defaultDateValue(dateFrom)} />
            <DateInput dateType="to" dispatch={dispatch} value={defaultDateValue(dateTo)} />
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
                      value: getDateRangeLabel(dateFrom, dateTo)
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

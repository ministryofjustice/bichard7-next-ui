import { Dispatch } from "react"
import { SerializedCourtDateRange } from "types/CaseListQueryParams"
import { FilterAction } from "types/CourtCaseFilter"

interface Props {
  dateType: "from" | "to"
  dispatch: Dispatch<FilterAction>
  value: string
  dateRange: SerializedCourtDateRange | undefined
}

const DateInput: React.FC<Props> = ({ dateType, dispatch, value, dateRange }: Props) => {
  const actionType = dateType === "from" ? "dateFrom" : "dateTo"
  const renderSameDateButton = dateType == "to" && dateRange?.from !== undefined ? true : false
  const setSameDateValue = () => {
    if (dateRange?.from !== undefined) {
      dispatch({ method: "add", type: actionType, value: dateRange.from })
    }
  }

  console.log(`${dateType} value: `, value)
  const SameDateButton = (
    <button id={"apply-same-date-button"} type="button" onClick={setSameDateValue}>
      {"Same date"}
    </button>
  )

  return (
    <div className="govuk-form-group">
      <>
        <label className="govuk-label govuk-label--m" htmlFor={`date-${dateType}`}>
          {`Date ${dateType}:`}
          {renderSameDateButton && SameDateButton}
        </label>
      </>
      <input
        className="govuk-input"
        type="date"
        id={`date-${dateType}`}
        name={dateType}
        value={value}
        onChange={(event) => {
          dispatch({ method: "add", type: actionType, value: event.target.value })
        }}
      />
    </div>
  )
}

export default DateInput

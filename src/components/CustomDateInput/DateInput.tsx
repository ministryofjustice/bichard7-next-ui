import { Dispatch } from "react"
import { FilterAction } from "types/CourtCaseFilter"

interface Props {
  dateType: "from" | "to"
  dispatch: Dispatch<FilterAction>
  value: string
}

const DateInput: React.FC<Props> = ({ dateType, dispatch, value }: Props) => {
  const actionType = dateType === "from" ? "dateFrom" : "dateTo"
  const renderSameDateButton = dateType == "to" ? true : false
  const SameDateButton = (
    <button id={"apply-same-date-button"} type="button">
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

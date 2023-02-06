import { Dispatch } from "react"
import { FilterAction } from "types/CourtCaseFilter"

interface Props {
  dateType: string
  dispatch: Dispatch<FilterAction>
}

const DateInput: React.FC<Props> = ({ dateType, dispatch }: Props) => {
  const actionType = dateType === "from" ? "customDateFrom" : "customDateTo"
  return (
    <div className="govuk-form-group">
      <label className="govuk-label govuk-label--m" htmlFor={`date-${dateType}`}>
        {`Date ${dateType}:`}
      </label>
      <input
        className="govuk-input"
        type="date"
        id={`date-${dateType}`}
        name={dateType}
        onChange={(event) => {
          const date = new Date(Date.parse(event.target.value))
          dispatch({ method: "add", type: actionType, value: date })
        }}
      />
    </div>
  )
}

export default DateInput

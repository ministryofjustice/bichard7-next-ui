import { Dispatch } from "react"
import { FilterAction } from "types/CourtCaseFilter"

interface Props {
  dateType: "from" | "to"
  dispatch: Dispatch<FilterAction>
  defaultValue: string
}

const DateInput: React.FC<Props> = ({ dateType, dispatch, defaultValue }: Props) => {
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
        defaultValue={defaultValue}
        onChange={(event) => {
          if (Date.parse(event.target.value)) {
            dispatch({ method: "add", type: actionType, value: new Date(Date.parse(event.target.value)) })
          }
        }}
      />
    </div>
  )
}

export default DateInput

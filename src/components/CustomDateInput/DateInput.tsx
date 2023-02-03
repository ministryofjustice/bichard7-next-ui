import { Dispatch } from "react"
import { FilterAction } from "types/CourtCaseFilter"

interface Props {
  dateType: string
  dispatch: Dispatch<FilterAction>
}

const DateInput: React.FC<Props> = ({ dateType, dispatch }: Props) => {
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
        onChange={(event) => dispatch({ method: "add", type: "customDate", value: event.target.value })}
      />
    </div>
  )
}

export default DateInput

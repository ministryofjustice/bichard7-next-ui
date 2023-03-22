import { Dispatch } from "react"
import { SerializedCourtDateRange } from "types/CaseListQueryParams"
import { FilterAction } from "types/CourtCaseFilter"
import { useCustomStyles } from "../../../styles/customStyles"

interface Props {
  dateType: "from" | "to"
  dispatch: Dispatch<FilterAction>
  value: string
  dateRange: SerializedCourtDateRange | undefined
}

const DateInput: React.FC<Props> = ({ dateType, dispatch, value, dateRange }: Props) => {
  const customStyle = useCustomStyles()
  const actionType = dateType === "from" ? "dateFrom" : "dateTo"
  const renderSameDateButton = dateType === "to" && dateRange?.from
  const setSameDateValue = () => {
    if (dateRange?.from) {
      dispatch({ method: "add", type: actionType, value: dateRange.from })
    }
  }

  const SameDateButton = (
    <button
      style={{ marginLeft: "160px" }}
      type="button"
      className={`${customStyle["small-button--tag"]}`}
      id={"apply-same-date-button"}
      onClick={setSameDateValue}
    >
      {"Same date"}
    </button>
  )

  return (
    <div className="govuk-form-group">
      <>
        <label className="govuk-body" htmlFor={`date-${dateType}`}>
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

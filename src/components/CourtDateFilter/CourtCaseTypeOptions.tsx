import type { Dispatch } from "react"
import { Reason } from "types/CaseListQueryParams"
import type { FilterAction } from "types/CourtCaseFilter"

interface Props {
  courtCaseTypes?: Reason[]
  dispatch: Dispatch<FilterAction>
}

const courtCaseTypeOptions = ["Exceptions", "Triggers"]

const CourtCaseTypeOptions: React.FC<Props> = ({ courtCaseTypes, dispatch }: Props) => {
  console.log(courtCaseTypes)
  return (
    <fieldset className="govuk-fieldset">
      <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
        {courtCaseTypeOptions.map((caseType) => (
          <div className="govuk-checkboxes__item" key={caseType}>
            <input
              className="govuk-checkboxes__input"
              id={`${caseType.toLowerCase()}-type`}
              name="type"
              type="checkbox"
              value={caseType}
              checked={courtCaseTypes && courtCaseTypes.includes(caseType as Reason)}
              onChange={(event) => {
                const value = event.currentTarget.value === "Triggers" ? "Triggers" : "Exceptions"
                dispatch({ method: event.currentTarget.checked ? "add" : "remove", type: "reason", value })
              }}
            ></input>
            <label className="govuk-label govuk-checkboxes__label" htmlFor={`${caseType.toLowerCase()}-type`}>
              {caseType}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  )
}

export default CourtCaseTypeOptions

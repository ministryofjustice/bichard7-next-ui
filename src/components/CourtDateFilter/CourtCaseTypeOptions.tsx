import { Reason } from "types/CaseListQueryParams"
import type { MouseEvent } from "react"

interface Props {
  courtCaseTypes?: Reason[]
  onClick: (option: string) => void
}

const courtCaseTypeOptions = ["Exceptions", "Triggers"]

const CourtCaseTypeOptions: React.FC<Props> = ({ courtCaseTypes, onClick }: Props) => {
  return (
    <fieldset className="govuk-fieldset">
      <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">{"Case type"}</legend>
      <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
        {courtCaseTypeOptions.map((caseType) => (
          <div className="govuk-checkboxes__item" key={caseType}>
            <input
              className="govuk-checkboxes__input"
              id={`${caseType.toLowerCase()}-type`}
              name="type"
              type="checkbox"
              value={caseType}
              defaultChecked={courtCaseTypes && courtCaseTypes.includes(caseType as Reason)}
              onClick={(event: MouseEvent<HTMLInputElement>) => onClick(event.currentTarget.value)}
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

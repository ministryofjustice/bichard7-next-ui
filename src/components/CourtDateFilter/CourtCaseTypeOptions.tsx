import { Reason } from "types/CaseListQueryParams"

interface Props {
  courtCaseTypes?: Reason[]
}

const courtCaseTypeOptions = ["Exceptions", "Triggers"]

const CourtCaseTypeOptions: React.FC<Props> = ({ courtCaseTypes }: Props) => (
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
        ></input>
        <label className="govuk-label govuk-checkboxes__label" htmlFor={`${caseType.toLowerCase()}-type`}>
          {caseType}
        </label>
      </div>
    ))}
  </div>
)

export default CourtCaseTypeOptions

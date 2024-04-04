import type { Dispatch } from "react"
import { RecordType } from "types/CaseListQueryParams"
import type { FilterAction } from "types/CourtCaseFilter"
import { recordTypeOptions as defaultRecordTypeOptions } from "utils/reasonOptions"

interface Props {
  recordTypeValue?: RecordType
  recordTypeOptions?: RecordType[]
  dispatch: Dispatch<FilterAction>
}

const ReasonFilterOptions: React.FC<Props> = ({
  recordTypeValue: reasonValue,
  recordTypeOptions: recordTypeOptions = defaultRecordTypeOptions,
  dispatch
}: Props) => {
  return (
    <fieldset className="govuk-fieldset">
      <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
        {recordTypeOptions.map((recordType) => (
          <div className={`govuk-radios__item ${recordType.toLowerCase()}`} key={recordType}>
            <input
              className="govuk-radios__input"
              id={`${recordType.toLowerCase()}-type`}
              name="recordType"
              type="radio"
              value={recordType}
              checked={reasonValue && reasonValue == recordType}
              onChange={(event) => {
                const value = event.currentTarget.value as RecordType
                dispatch({ method: event.currentTarget.checked ? "add" : "remove", type: "recordType", value })
              }}
            ></input>
            <label className="govuk-label govuk-radios__label" htmlFor={`${recordType.toLowerCase()}-type`}>
              {recordType}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  )
}

export default ReasonFilterOptions

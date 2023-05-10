import type { Dispatch } from "react"
import { Reason } from "types/CaseListQueryParams"
import type { FilterAction } from "types/CourtCaseFilter"
import { reasonOptions } from "utils/reasonOptions"
import ConditionalRender from "components/ConditionalRender"
import TriggersAccordion from "./TriggersAccordion"

interface Props {
  reasons?: Reason[]
  dispatch: Dispatch<FilterAction>
}

const ReasonFilterOptions: React.FC<Props> = ({ reasons, dispatch }: Props) => {
  return (
    <fieldset className="govuk-fieldset">
      <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
        {reasonOptions.map((reason) => (
          <div className="govuk-checkboxes__item" key={reason}>
            <input
              className="govuk-checkboxes__input"
              id={`${reason.toLowerCase()}-type`}
              name="type"
              type="checkbox"
              value={reason}
              checked={reasons && reasons.includes(reason as Reason)}
              onChange={(event) => {
                const value = event.currentTarget.value as Reason
                dispatch({ method: event.currentTarget.checked ? "add" : "remove", type: "reason", value })
              }}
            ></input>
            <label className="govuk-label govuk-checkboxes__label" htmlFor={`${reason.toLowerCase()}-type`}>
              {reason}{" "}
            </label>
            <ConditionalRender isRendered={reason === "Bails"}>
              <TriggersAccordion />
            </ConditionalRender>
          </div>
        ))}
      </div>
    </fieldset>
  )
}

export default ReasonFilterOptions

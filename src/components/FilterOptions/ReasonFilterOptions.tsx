import type { Dispatch } from "react"
import { Reason } from "types/CaseListQueryParams"
import type { FilterAction } from "types/CourtCaseFilter"
import { blue } from "utils/colours"
import { reasonOptions } from "utils/reasonOptions"

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
            {reason === "Bails" && (
              <a
                className="govuk-link"
                href="/"
                onClick={(event) => {
                  event.preventDefault()
                  console.log("clicked!")
                }}
              >
                <svg
                  fill={blue}
                  role="presentation"
                  focusable="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 25 25"
                  height="20"
                  width="20"
                >
                  <path
                    d="M13.7,18.5h-2.4v-2.4h2.4V18.5z M12.5,13.7c-0.7,0-1.2-0.5-1.2-1.2V7.7c0-0.7,0.5-1.2,1.2-1.2s1.2,0.5,1.2,1.2v4.8
    C13.7,13.2,13.2,13.7,12.5,13.7z M12.5,0.5c-6.6,0-12,5.4-12,12s5.4,12,12,12s12-5.4,12-12S19.1,0.5,12.5,0.5z"
                  />
                </svg>
              </a>
            )}
          </div>
        ))}
      </div>
    </fieldset>
  )
}

export default ReasonFilterOptions

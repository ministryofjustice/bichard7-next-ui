import { ChangeEvent, Dispatch, useEffect, useRef } from "react"
import { FilterAction } from "types/CourtCaseFilter"
import { IndeterminateCheckboxWrapper } from "./IndeterminateCheckbox.styles"

interface IndeterminateCheckboxProps {
  id: string
  value: string
  checkedValue: string
  labelText: string
  indeterminate: boolean
  dispatch: Dispatch<FilterAction>
}

const IndeterminateCheckbox = ({
  id,
  value,
  checkedValue,
  labelText,
  indeterminate,
  dispatch
}: IndeterminateCheckboxProps): JSX.Element => {
  const checkboxRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (checkboxRef?.current) {
      checkboxRef.current.indeterminate = indeterminate
    }
  }, [checkboxRef, indeterminate])

  return (
    <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
      <div className="govuk-checkboxes__item">
        <IndeterminateCheckboxWrapper>
          <input
            ref={checkboxRef}
            className="govuk-checkboxes__input"
            id={id}
            name={id}
            type="checkbox"
            value={value}
            checked={value === checkedValue}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              dispatch({
                method: event.currentTarget.checked
                  ? "add"
                  : event.currentTarget.indeterminate
                    ? "indeterminate"
                    : "remove",
                type: "triggerIndeterminate",
                value
              })
            }}
          ></input>
          <label className="govuk-label govuk-checkboxes__label" htmlFor={id}>
            {labelText}
          </label>
        </IndeterminateCheckboxWrapper>
      </div>
    </div>
  )
}

export default IndeterminateCheckbox

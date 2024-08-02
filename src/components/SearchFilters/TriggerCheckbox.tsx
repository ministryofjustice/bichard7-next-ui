import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { ChangeEvent, Dispatch } from "react"
import getShortTriggerCode from "services/entities/transformers/getShortTriggerCode"
import { FilterAction } from "types/CourtCaseFilter"
import getTriggerWithDescription from "utils/formatReasons/getTriggerWithDescription"
import { CheckboxWrapper, TriggerCheckboxLabel } from "./TriggerCheckbox.styles"

interface TriggerCheckboxProps {
  triggerCode: TriggerCode
  selectedTrigger?: boolean
  triggerCodeCount: number
  dispatch: Dispatch<FilterAction>
}

const TriggerCheckbox = ({
  triggerCode,
  selectedTrigger,
  triggerCodeCount,
  dispatch
}: TriggerCheckboxProps): JSX.Element => {
  const triggerShortCode = getShortTriggerCode(triggerCode) ?? ""

  return (
    <fieldset className="govuk-fieldset">
      <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
        <CheckboxWrapper className="govuk-checkboxes__item">
          <input
            className="govuk-checkboxes__input"
            id={triggerCode.toLowerCase()}
            type="checkbox"
            value={triggerCode}
            checked={selectedTrigger}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              dispatch({
                method: event.currentTarget.checked ? "add" : "remove",
                type: "reasonCodesCheckbox",
                value: triggerShortCode
              })
            }}
          ></input>
          <TriggerCheckboxLabel className="govuk-label govuk-checkboxes__label" htmlFor={triggerCode.toLowerCase()}>
            <div className="trigger-description">{`${getTriggerWithDescription(triggerCode, true)}`}</div>
            <div className="trigger-count">{`(${triggerCodeCount})`}</div>
          </TriggerCheckboxLabel>
        </CheckboxWrapper>
      </div>
    </fieldset>
  )
}

export default TriggerCheckbox

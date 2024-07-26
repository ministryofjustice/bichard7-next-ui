import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import getShortTriggerCode from "services/entities/transformers/getShortTriggerCode"
import getTriggerWithDescription from "utils/formatReasons/getTriggerWithDescription"
import { TriggerCheckboxLabel } from "./TriggerCheckbox.styles"

interface TriggerCheckboxProps {
  triggerCode: TriggerCode
}

const TriggerCheckbox = ({ triggerCode }: TriggerCheckboxProps): JSX.Element => {
  return (
    <fieldset className="govuk-fieldset">
      <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
        <div className="govuk-checkboxes__item">
          <input
            className="govuk-checkboxes__input"
            id={triggerCode.toLowerCase()}
            name={triggerCode.toLowerCase()}
            type="checkbox"
            // value={value}
            // checked={value == "Resolved"}
            // onChange={(event: ChangeEvent<HTMLInputElement>) => {
            //   dispatch({
            //     method: event.currentTarget.checked ? "add" : "remove",
            //     type: "caseState",
            //     value: "Resolved"
            //   })
            // }}
          ></input>
          <TriggerCheckboxLabel className="govuk-label govuk-checkboxes__label" htmlFor={triggerCode.toLowerCase()}>
            {getShortTriggerCode(triggerCode)}
            {" - "}
            {getTriggerWithDescription(triggerCode, true)}
          </TriggerCheckboxLabel>
        </div>
      </div>
    </fieldset>
  )
}

export default TriggerCheckbox

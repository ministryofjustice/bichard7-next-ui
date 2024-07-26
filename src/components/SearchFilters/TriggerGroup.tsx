import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import TriggerCheckbox from "./TriggerCheckbox"
import { TriggerGroupList } from "./TriggerGroup.styles"

interface TriggerGroupProps {
  name: string
  triggers: TriggerCode[]
}

const TriggerGroup = ({ name, triggers }: TriggerGroupProps): JSX.Element => {
  return (
    <fieldset className="govuk-fieldset">
      <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
        <div className="govuk-checkboxes__item">
          <input
            className="govuk-checkboxes__input"
            id={name.toLowerCase()}
            name={name.toLowerCase()}
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
          <label className="govuk-label govuk-checkboxes__label" htmlFor={name.toLowerCase()}>
            {name}
          </label>
        </div>
      </div>

      <TriggerGroupList>
        {triggers.map((triggerCode) => (
          <TriggerCheckbox key={triggerCode} triggerCode={triggerCode} />
        ))}
      </TriggerGroupList>
    </fieldset>
  )
}

export default TriggerGroup

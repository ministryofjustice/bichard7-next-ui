import GroupedTriggerCodes from "@moj-bichard7-developers/bichard7-next-data/dist/types/GroupedTriggerCodes"
import { TriggerCodeGroups } from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { Legend } from "features/CourtCaseFilters/ExpandingFilters.styles"
import TriggerGroup from "./TriggerGroup"

const TriggerGroups = () => {
  return (
    <fieldset className="govuk-fieldset">
      <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
        <Legend>{"Trigger groups"}</Legend>
      </legend>
      {Object.keys(GroupedTriggerCodes).map((key, i) => (
        <TriggerGroup
          key={`trigger-group-${i}`}
          name={key}
          triggers={GroupedTriggerCodes[key as keyof typeof TriggerCodeGroups]}
        />
      ))}
    </fieldset>
  )
}

export default TriggerGroups

import GroupedTriggerCodes from "@moj-bichard7-developers/bichard7-next-data/dist/types/GroupedTriggerCodes"
import { Legend } from "features/CourtCaseFilters/ExpandingFilters.styles"
import { Dispatch } from "react"
import { FilterAction, ReasonCode } from "types/CourtCaseFilter"
import allGroupedTriggers from "utils/triggerGroups/allGroupedTriggers"
import filteredReasonCodes from "utils/triggerGroups/filteredReasonCodes"
import TriggerGroup from "./TriggerGroup"

interface TriggerGroupProps {
  dispatch: Dispatch<FilterAction>
  reasonCodes: ReasonCode[]
}

const TriggerGroups = ({ dispatch, reasonCodes }: TriggerGroupProps): JSX.Element => {
  return (
    <fieldset className="govuk-fieldset">
      <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
        <Legend>{"Trigger groups"}</Legend>
      </legend>
      {Object.keys(GroupedTriggerCodes).map((key, i) => (
        <TriggerGroup
          key={`trigger-group-${i}`}
          name={key}
          allGroupTriggers={allGroupedTriggers(key)}
          filteredReasonCodes={filteredReasonCodes(allGroupedTriggers(key), reasonCodes)}
          dispatch={dispatch}
        />
      ))}
    </fieldset>
  )
}

export default TriggerGroups

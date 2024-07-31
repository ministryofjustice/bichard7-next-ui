import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import ConditionalRender from "components/ConditionalRender"
import IndeterminateCheckbox from "components/IndeterminateCheckbox"
import { Dispatch } from "react"
import getShortTriggerCode from "services/entities/transformers/getShortTriggerCode"
import { FilterAction, ReasonCode } from "types/CourtCaseFilter"
import allTriggersSelected from "utils/triggerGroups/allTriggersSelected"
import selectedTrigger from "utils/triggerGroups/selectedTrigger"
import someTriggersSelected from "utils/triggerGroups/someTriggersSelected"
import TriggerCheckbox from "./TriggerCheckbox"
import { TriggerGroupList } from "./TriggerGroup.styles"

interface TriggerGroupProps {
  name: string
  allGroupTriggers: TriggerCode[]
  filteredReasonCodes: ReasonCode[]
  dispatch: Dispatch<FilterAction>
}

const TriggerGroup = ({ name, allGroupTriggers, filteredReasonCodes, dispatch }: TriggerGroupProps): JSX.Element => {
  const someSelected = someTriggersSelected(allGroupTriggers, filteredReasonCodes)
  const allSelected = allTriggersSelected(allGroupTriggers, filteredReasonCodes)

  return (
    <fieldset className="govuk-fieldset">
      <IndeterminateCheckbox
        id={name.toLowerCase()}
        checkedValue={allSelected}
        labelText={name}
        indeterminate={someSelected}
        value={allGroupTriggers.map((trigger) => getShortTriggerCode(trigger) ?? "")}
        dispatch={dispatch}
      />

      <ConditionalRender isRendered={allSelected || someSelected}>
        <TriggerGroupList>
          {allGroupTriggers.map((triggerCode) => (
            <TriggerCheckbox
              key={triggerCode}
              triggerCode={triggerCode}
              selectedTrigger={selectedTrigger(triggerCode, filteredReasonCodes)}
              dispatch={dispatch}
            />
          ))}
        </TriggerGroupList>
      </ConditionalRender>
    </fieldset>
  )
}

export default TriggerGroup

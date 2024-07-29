import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import ConditionalRender from "components/ConditionalRender"
import IndeterminateCheckbox from "components/IndeterminateCheckbox"
import { Dispatch } from "react"
import getLongTriggerCode from "services/entities/transformers/getLongTriggerCode"
import getShortTriggerCode from "services/entities/transformers/getShortTriggerCode"
import { FilterAction, ReasonCode } from "types/CourtCaseFilter"
import TriggerCheckbox from "./TriggerCheckbox"
import { TriggerGroupList } from "./TriggerGroup.styles"

interface TriggerGroupProps {
  name: string
  allGroupTriggers: TriggerCode[]
  filteredReasonCodes: ReasonCode[]
  dispatch: Dispatch<FilterAction>
}

const selectedTrigger = (triggerCode: string, filteredReasonCodes: ReasonCode[]): boolean | undefined =>
  !!filteredReasonCodes.find((reasonCode) => getLongTriggerCode(reasonCode.value) === triggerCode)

const someSelected = (allGroupTriggers: TriggerCode[], filteredReasonCodes: ReasonCode[]): boolean => {
  const some = allGroupTriggers.filter((triggerCode) => selectedTrigger(triggerCode, filteredReasonCodes))

  return some.length > 0 && some.length !== allGroupTriggers.length
}

const noneSelected = (allGroupTriggers: TriggerCode[], filteredReasonCodes: ReasonCode[]): boolean =>
  allGroupTriggers.filter((triggerCode) => selectedTrigger(triggerCode, filteredReasonCodes)).length === 0

const allSelected = (allGroupTriggers: TriggerCode[], filteredReasonCodes: ReasonCode[]): boolean => {
  const selected = filteredReasonCodes.map((reasonCode) => getLongTriggerCode(reasonCode.value))

  if (allGroupTriggers.length === selected.length) {
    return true
  }
  return false
}

const TriggerGroup = ({ name, allGroupTriggers, filteredReasonCodes, dispatch }: TriggerGroupProps): JSX.Element => {
  return (
    <fieldset className="govuk-fieldset">
      <IndeterminateCheckbox
        id={name.toLowerCase()}
        checkedValue={allSelected(allGroupTriggers, filteredReasonCodes)}
        labelText={name}
        indeterminate={someSelected(allGroupTriggers, filteredReasonCodes)}
        value={allGroupTriggers.map((trigger) => getShortTriggerCode(trigger) ?? "")}
        dispatch={dispatch}
      />

      <ConditionalRender
        isRendered={
          !noneSelected(allGroupTriggers, filteredReasonCodes) || someSelected(allGroupTriggers, filteredReasonCodes)
        }
      >
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

import GroupedTriggerCodes from "@moj-bichard7-developers/bichard7-next-data/dist/types/GroupedTriggerCodes"
import TriggerCode, { TriggerCodeGroups } from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { Legend } from "features/CourtCaseFilters/ExpandingFilters.styles"
import { Dispatch } from "react"
import getLongTriggerCode from "services/entities/transformers/getLongTriggerCode"
import { FilterAction, ReasonCode } from "types/CourtCaseFilter"
import TriggerGroup from "./TriggerGroup"

interface TriggerGroupProps {
  dispatch: Dispatch<FilterAction>
  reasonCodes: ReasonCode[]
}

const groupedTriggerCodes = (key: string): TriggerCode[] => GroupedTriggerCodes[key as keyof typeof TriggerCodeGroups]

const filteredReasonCodes = (grpTriggerCodes: TriggerCode[], reasonCodes: ReasonCode[]) => {
  return reasonCodes.filter((reasonCode) => {
    const validTriggerCode = TriggerCode[getLongTriggerCode(reasonCode.value) as keyof typeof TriggerCode]

    return grpTriggerCodes.includes(validTriggerCode)
  })
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
          allGroupTriggers={groupedTriggerCodes(key)}
          filteredReasonCodes={filteredReasonCodes(groupedTriggerCodes(key), reasonCodes)}
          dispatch={dispatch}
        />
      ))}
    </fieldset>
  )
}

export default TriggerGroups

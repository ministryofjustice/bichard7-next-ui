import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import getLongTriggerCode from "services/entities/transformers/getLongTriggerCode"
import { ReasonCode } from "types/CourtCaseFilter"

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

export { allSelected, noneSelected, selectedTrigger, someSelected }

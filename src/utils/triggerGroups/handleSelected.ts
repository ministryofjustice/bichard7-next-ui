import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import getLongTriggerCode from "services/entities/transformers/getLongTriggerCode"
import { ReasonCode } from "types/CourtCaseFilter"
import selectedTrigger from "./selectedTrigger"

const noneSelected = (allGroupTriggers: TriggerCode[], filteredReasonCodes: ReasonCode[]): boolean =>
  allGroupTriggers.filter((triggerCode) => selectedTrigger(triggerCode, filteredReasonCodes)).length === 0

const allSelected = (allGroupTriggers: TriggerCode[], filteredReasonCodes: ReasonCode[]): boolean => {
  const selected = filteredReasonCodes.map((reasonCode) => getLongTriggerCode(reasonCode.value))

  if (allGroupTriggers.length === selected.length) {
    return true
  }
  return false
}

export { allSelected, noneSelected }

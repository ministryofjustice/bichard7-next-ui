import type KeyValuePair from "@moj-bichard7-developers/bichard7-next-core/dist/types/KeyValuePair"

export const caseStateLabels: KeyValuePair<string, string> = {
  "Unresolved and resolved": "Unresolved & resolved cases",
  Resolved: "Resolved cases"
}

const caseStateFilters: string[] = ["Unresolved and resolved", "Resolved"]

export default caseStateFilters

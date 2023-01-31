import KeyValuePair from "types/KeyValuePair"

export const caseStateLabels: KeyValuePair<string, string> = {
  "Unresolved and resolved": "Unresolved & resolved cases",
  Resolved: "Resolved cases"
}

const caseStateFilters: string[] = ["Unresolved and resolved", "Resolved"]
export const myCaseStateFilters = "View cases allocated to me"

export default caseStateFilters

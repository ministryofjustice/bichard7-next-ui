import { UserGroup } from "types/UserGroup"
import hashedPassword from "../fixtures/hashedPassword"
import CaseDetailsTab from "types/CaseDetailsTab"
import { isSupervisor, userAccess } from "utils/userPermissions"

export function confirmFiltersAppliedContains(filterTag: string) {
  cy.get(".moj-filter-tags a.moj-filter__tag").contains(filterTag)
}

export const exactMatch = (keyword: string): RegExp => {
  return new RegExp("^" + keyword + "$")
}

export const confirmMultipleFieldsDisplayed = (fields: string[]) => {
  fields.forEach((field) => {
    cy.contains(field)
  })
}

export const confirmMultipleFieldsNotDisplayed = (fields: string[]) => {
  fields.forEach((field) => {
    cy.contains(field).should("not.exist")
  })
}

export const removeFilterChip = () => {
  cy.get("li button.moj-filter__tag").trigger("click")
  cy.get(".moj-filter__tag").should("not.exist")
}

export const filterByCaseAge = (caseAgeId: string) => {
  cy.get("#case-age").click()
  cy.get(caseAgeId).click()
}

export const filterByDateRange = (dateFrom: string, dateTo: string) => {
  cy.get("#date-range").click()

  cy.get("#date-from").click()
  cy.get("#date-from").type(dateFrom)

  cy.get("#date-to").click()
  cy.get("#date-to").type(dateTo)
}

export const loginAndGoToUrl = (emailAddress = "bichard01@example.com", url = "/bichard") => {
  cy.login(emailAddress, "password")
  cy.visit(url)
}

export const clickTab = (tab: CaseDetailsTab) => {
  cy.get(".moj-sub-navigation a").contains(tab).click()
}

export const newUserLogin = ({ user, groups }: { user?: string; groups?: UserGroup[] }) => {
  user = user ?? (groups?.map((g) => g.toLowerCase()).join("") || "nogroups")
  const email = `${user}@example.com`

  const userIsSupervisor = isSupervisor({ groups: groups ?? [] })

  cy.task("insertUsers", {
    users: [
      {
        username: user,
        visibleForces: ["01"],
        forenames: "Bichard Test User",
        surname: "01",
        email: email,
        password: hashedPassword,
        hasAccessTo: userAccess({ groups: groups ?? [] }),
        isSupervisor: userIsSupervisor
      }
    ],
    userGroups: [UserGroup.NewUI, ...(groups ?? [])]
  })

  cy.login(email, "password")
}

export const confirmCaseDisplayed = (PTIURN: string) => {
  cy.get("tr").not(":first").get("td:nth-child(5)").contains(PTIURN).should("exist")
}

export const confirmCaseNotDisplayed = (PTIURN: string) => {
  cy.get("tr").not(":first").get("td:nth-child(5)").contains(PTIURN).should("not.exist")
}

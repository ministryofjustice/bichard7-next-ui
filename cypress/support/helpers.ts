import { UserGroup } from "types/UserGroup"
import hashedPassword from "../fixtures/hashedPassword"
import CaseDetailsTab from "types/CaseDetailsTab"
import { userAccess } from "utils/userPermissions"
import SurveyFeedback from "services/entities/SurveyFeedback"
import User from "services/entities/User"

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

  cy.task("insertUsers", {
    users: [
      {
        username: user,
        visibleForces: ["01"],
        forenames: "Bichard Test User",
        surname: "01",
        email: email,
        password: hashedPassword,
        hasAccessTo: userAccess({ groups: groups ?? [] })
      }
    ],
    userGroups: [UserGroup.NewUI, ...(groups ?? [])]
  })

  cy.login(email, "password")
}

export const confirmCaseDisplayed = (PTIURN: string) => {
  cy.get("tbody tr td:nth-child(5)").contains(PTIURN).should("exist")
}

export const confirmCaseNotDisplayed = (PTIURN: string) => {
  cy.get("tbody tr td:nth-child(5)").contains(PTIURN).should("not.exist")
}

export const confirmReasonDisplayed = (reason: string) => {
  cy.get("tbody tr td:nth-child(8)").contains(reason).should("exist")
}

export const confirmReasonNotDisplayed = (reason: string) => {
  cy.get("tbody tr td:nth-child(8)").contains(reason).should("not.exist")
}

export const expectToHaveNumberOfFeedbacks = (number: number) => {
  cy.task("getAllFeedbacksFromDatabase").then((result) => {
    const feedbackResults = result as SurveyFeedback[]
    expect(feedbackResults.length).equal(number)
  })
}

export const setupDefaultUsers = () => {
  const defaultUsers: Partial<User>[] = Array.from(Array(5)).map((_value, idx) => {
    return {
      username: `Bichard0${idx}`,
      visibleForces: [`00${idx}`],
      visibleCourts: [`${idx}C`],
      forenames: "Bichard Test User",
      surname: `0${idx}`,
      email: `bichard0${idx}@example.com`,
      password: hashedPassword
    }
  })
  defaultUsers.push({
    username: `Bichard011111`,
    visibleForces: [`0011111`],
    forenames: "Bichard Test User",
    surname: `011111`,
    email: `bichard011111@example.com`,
    password: hashedPassword
  })
  defaultUsers.push({
    username: `TriggerHandler`,
    visibleForces: [`0011111`],
    forenames: "Trigger Handler User",
    surname: `011111`,
    email: `triggerhandler@example.com`,
    password: hashedPassword
  })
  defaultUsers.push({
    username: `ExceptionHandler`,
    visibleForces: [`0011111`],
    forenames: "Exception Handler User",
    surname: `011111`,
    email: `exceptionhandler@example.com`,
    password: hashedPassword
  })
  defaultUsers.push({
    username: `GeneralHandler`,
    visibleForces: [`0011111`],
    forenames: "General Handler User",
    surname: `011111`,
    email: `generalhandler@example.com`,
    password: hashedPassword
  })
  defaultUsers.push({
    username: `Supervisor`,
    visibleForces: [`0011111`],
    forenames: "Sup",
    surname: "User",
    email: "supervisor@example.com",
    password: hashedPassword
  })
  defaultUsers.push({
    username: `NoGroups`,
    visibleForces: [`0011111`],
    forenames: "No",
    surname: "Groups",
    email: "nogroups@example.com",
    password: hashedPassword
  })

  return defaultUsers
}

export const defaultSetup = () => {
  const defaultUsers = setupDefaultUsers()
  cy.task("clearAllFeedbacksFromDatabase")
  cy.task("clearUsers")
  cy.task("insertUsers", { users: defaultUsers, userGroups: ["B7NewUI_grp"] })
  defaultUsers
    .filter((u) => u.forenames === "Bichard Test User")
    .map((user) => {
      cy.task("insertIntoUserGroup", { emailAddress: user.email, groupName: "B7GeneralHandler_grp" })
    })
  cy.task("insertIntoUserGroup", { emailAddress: "triggerhandler@example.com", groupName: "B7TriggerHandler_grp" })
  cy.task("insertIntoUserGroup", {
    emailAddress: "exceptionhandler@example.com",
    groupName: "B7ExceptionHandler_grp"
  })
  cy.task("insertIntoUserGroup", {
    emailAddress: "generalhandler@example.com",
    groupName: "B7GeneralHandler_grp"
  })
  cy.task("insertIntoUserGroup", { emailAddress: "supervisor@example.com", groupName: "B7Supervisor_grp" })
}

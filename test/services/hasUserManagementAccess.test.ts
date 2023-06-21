import hasUserManagementAccess, { Props } from "../../src/services/hasUserManagementAccess"

it("Should say that user has only access to User Management when user has one of the User Management's user groups", () => {
  const hasAccess = hasUserManagementAccess({ groups: ["UserManager"] } as Props)
  expect(hasAccess).toBe(true)
})

it("Should check if it doesn't have access to the UserManagement page", () => {
  const hasAccess = hasUserManagementAccess({
    groups: [
      "GeneralHandler",
      "Allocator",
      "Audit",
      "ExceptionHandler",
      "GeneralHandler",
      "Supervisor",
      "TriggerHandler",
      "AuditLoggingManager",
      "SuperUserManager",
      "NewUI"
    ]
  } as Props)

  expect(hasAccess).toBe(false)
})

it("Should say it does not have access to User Management when there are no user groups", () => {
  const hasAccess = hasUserManagementAccess({
    groups: ["IncorrectGroupName"]
  } as unknown as Props)
  expect(hasAccess).toBe(false)
})

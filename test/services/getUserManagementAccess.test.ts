import getUserManagementAccess, { AuthenticationTokenPayload } from "../../src/services/getUserManagementAccess"

it("should say that user has only access to User Management when user has one of the User Management's user groups", () => {
  const hasAccess = getUserManagementAccess({ groups: ["UserManager"] } as AuthenticationTokenPayload)
  expect(hasAccess).toBe(true)
})

it("should check if it doesn't have access to the UserManagement page", () => {
  const hasAccess = getUserManagementAccess({
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
  } as AuthenticationTokenPayload)

  expect(hasAccess).toBe(false)
})

it("should say it does not have access to User Management when there are no user groups", () => {
  const hasAccess = getUserManagementAccess({
    groups: ["IncorrectGroupName"]
  } as unknown as AuthenticationTokenPayload)
  expect(hasAccess).toBe(false)
})

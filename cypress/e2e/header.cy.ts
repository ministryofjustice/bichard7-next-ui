import hashedPassword from "../fixtures/hashedPassword"

describe("Home", () => {
  context("720p resolution", () => {
    beforeEach(() => {
      cy.task("clearCourtCases")
      cy.task("clearUsers")
      cy.viewport(1280, 720)
    })

    context("top-nav", () => {
      it("as a user that is not part of the 'UserManager' group, I should have access to these nav items", () => {
        cy.task("insertUsers", {
          users: [
            {
              username: `generalhandler2`,
              visibleForces: [`01`],
              forenames: "Bichard Test User",
              surname: `01`,
              email: `generalhandler2@example.com`,
              password:
                "$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw"
            }
          ],
          userGroups: ["B7NewUI_grp"]
        })
        cy.login("generalhandler2@example.com", "password")
        cy.visit("/bichard")

        cy.contains("nav a", "Case list").should("have.attr", "href", "/bichard/")
        cy.contains("nav a", "Reports").should("not.exist")
        cy.contains("nav a", "User management").should("not.exist")
        cy.contains("nav a", "Help").should("have.attr", "href", "/help/")
        cy.contains("nav a", "Sign out").should("have.attr", "href", "/users/logout/")
      })

      it("as a user who is part of the 'UserManager' group, I should have access to these nav items", () => {
        cy.task("insertUsers", {
          users: [
            {
              username: `Bichard01`,
              visibleForces: [`01`],
              forenames: "Bichard Test User",
              surname: `01`,
              email: `bichard01@example.com`,
              password: hashedPassword
            }
          ],
          userGroups: ["B7UserManager_grp", "B7NewUI_grp"]
        })
        cy.login("bichard01@example.com", "password")
        cy.visit("/bichard")

        cy.contains("nav a", "Case list").should("have.attr", "href", "/bichard/")
        cy.contains("nav a", "Reports").should("not.exist")
        cy.contains("nav a", "User management").should("have.attr", "href", "/users/users/")
        cy.contains("nav a", "Help").should("have.attr", "href", "/help/")
        cy.contains("nav a", "Sign out").should("have.attr", "href", "/users/logout/")
      })

      it("as a user that is part of the Supervisor group, I should have access to these nav items", () => {
        cy.task("insertUsers", {
          users: [
            {
              username: `supervisorUser`,
              visibleForces: [`01`],
              forenames: "Bichard Test User",
              surname: `01`,
              email: `supervisorUser@example.com`,
              password:
                "$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw"
            }
          ],
          userGroups: ["B7NewUI_grp", "B7Supervisor_grp"]
        })
        cy.login("supervisorUser@example.com", "password")
        cy.visit("/bichard")

        cy.contains("nav a", "Case list").should("have.attr", "href", "/bichard/")
        cy.contains("nav a", "Reports").should("have.attr", "href", "/bichard-ui/ReturnToReportIndex")
        cy.contains("nav a", "User management").should("not.exist")
        cy.contains("nav a", "Help").should("have.attr", "href", "/help/")
        cy.contains("nav a", "Sign out").should("have.attr", "href", "/users/logout/")
      })

      it.only("as a user that is part of all groups except Supervisor, I should not have access to the Reports tab", () => {
        cy.task("insertUsers", {
          users: [
            {
              username: `notSupervisorUser`,
              visibleForces: [`01`],
              forenames: "Bichard Test User",
              surname: `01`,
              email: `notSupervisorUser@example.com`,
              password:
                "$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw"
            }
          ],
          userGroups: [
            "B7Allocator_grp",
            "B7Audit_grp",
            "B7ExceptionHandler_grp",
            "B7GeneralHandler_grp",
            "B7TriggerHandler_grp",
            "B7UserManager_grp",
            "B7AuditLoggingManager_grp",
            "B7SuperUserManager_grp",
            "B7NewUI_grp"
          ]
        })
        cy.login("notSupervisorUser@example.com", "password")
        cy.visit("/bichard")

        cy.contains("nav a", "Reports").should("not.exist")
      })
    })
    context("phase banner", () => {
      it("displays a phase banner", () => {
        cy.task("insertUsers", {
          users: [
            {
              username: `generalhandler2`,
              visibleForces: [`01`],
              forenames: "Bichard Test User",
              surname: `01`,
              email: `generalhandler2@example.com`,
              password:
                "$argon2id$v=19$m=15360,t=2,p=1$CK/shCsqcAng1U81FDzAxA$UEPw1XKYaTjPwKtoiNUZGW64skCaXZgHrtNraZxwJPw"
            }
          ],
          userGroups: ["B7NewUI_grp"]
        })
        cy.login("generalhandler2@example.com", "password")
        cy.visit("/bichard")

        cy.contains("beta")
      })
    })
  })
})

export {}

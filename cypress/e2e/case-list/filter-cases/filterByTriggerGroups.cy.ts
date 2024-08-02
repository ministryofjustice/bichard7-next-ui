import GroupedTriggerCodes from "@moj-bichard7-developers/bichard7-next-data/dist/types/GroupedTriggerCodes"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { flatten } from "lodash"
import { TestTrigger } from "../../../../test/utils/manageTriggers"
import a11yConfig from "../../../support/a11yConfig"
import logAccessibilityViolations from "../../../support/logAccessibilityViolations"

describe("Filtering cases by trigger groups", () => {
  beforeEach(() => {
    cy.task("clearCourtCases")
    cy.loginAs("GeneralHandler")
  })

  after(() => {
    // cy.task("clearTriggers")
  })

  it("Should be accessible with trigger group is unchecked", () => {
    cy.visit("/bichard")

    cy.get("input#bails").should("exist")
    cy.get("input#bails").should("not.be.checked")

    cy.injectAxe()

    // Wait for the page to fully load
    cy.get("h1")

    cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
  })

  it("Should be accessible with trigger group is checked", () => {
    cy.visit("/bichard")

    cy.get("input#bails").should("exist")
    cy.get("input#bails").click()
    cy.get("input#bails").should("be.checked")

    cy.injectAxe()

    // Wait for the page to fully load
    cy.get("h1")

    cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
  })

  it("Should be accessible with trigger group is indeterminate", () => {
    cy.visit("/bichard")

    cy.get("input#bails").should("exist")
    cy.get("input#bails").click()
    cy.get("input#trpr0008").click()
    cy.get("input#bails:indeterminate").should("exist")

    cy.injectAxe()

    // Wait for the page to fully load
    cy.get("h1")

    cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
  })

  it("should show reason codes in the reason codes input when we click on Bails", () => {
    cy.visit("/bichard")

    cy.get("input#bails").should("exist")
    cy.get("input#bails").click()

    cy.get("input#reasonCodes").should("value", "PR08 PR10 PR20 PR30")
  })

  it("should show reason codes in the reason codes input when we click on Custody", () => {
    cy.visit("/bichard")

    cy.get("input#custody").should("exist")
    cy.get("input#custody").click()

    cy.get("input#reasonCodes").should("value", "PR01 PR05 PR06 PR19 PR21")
  })

  it("should show reason codes in the reason codes input when we click on Orders", () => {
    cy.visit("/bichard")

    cy.get("input#orders").should("exist")
    cy.get("input#orders").click()

    cy.get("input#reasonCodes").should("value", "PR03 PR16 PR25 PR26 PR29 PS08")
  })

  it("should show reason codes in the reason codes input when we click on Warrants", () => {
    cy.visit("/bichard")

    cy.get("input#warrants").should("exist")
    cy.get("input#warrants").click()

    cy.get("input#reasonCodes").should("value", "PR02 PR12")
  })

  it("should show reason codes filter chips when we click on a trigger group", () => {
    cy.visit("/bichard")

    cy.get("input#warrants").should("exist")
    cy.get("input#warrants").click()

    cy.get(".moj-filter__tag").contains("PR02")
    cy.get(".moj-filter__tag").contains("PR12")
  })

  describe("when using the using the group checkboxes", () => {
    beforeEach(() => {
      // Add 20 cases
      cy.task("insertCourtCasesWithFields", [
        { defendantName: "WAYNE Bruce", orgForPoliceFilter: "01" },
        { defendantName: "GORDON Barbara", orgForPoliceFilter: "01" },
        { defendantName: "PENNYWORTH Alfred", orgForPoliceFilter: "01" },
        { defendantName: "GRAYSON Richard", orgForPoliceFilter: "01" },
        { defendantName: "SAVAGE Pete", orgForPoliceFilter: "01" },
        { defendantName: "FALCONE Carmine", orgForPoliceFilter: "01" },
        { defendantName: "GORDON James", orgForPoliceFilter: "01" },
        { defendantName: "COLSON Gil", orgForPoliceFilter: "01" },
        { defendantName: "KYKLE Selina", orgForPoliceFilter: "01" },
        { defendantName: "COOPER Harriet", orgForPoliceFilter: "01" },
        { defendantName: "REID Britt", orgForPoliceFilter: "01" },
        { defendantName: "BENNETT Ethan", orgForPoliceFilter: "01" },
        { defendantName: "ROJAS Angel", orgForPoliceFilter: "01" },
        { defendantName: "YIN Ellen", orgForPoliceFilter: "01" },
        { defendantName: "KARLO Basil", orgForPoliceFilter: "01" },
        { defendantName: "GRAVES Mercy", orgForPoliceFilter: "01" },
        { defendantName: "GREY Francis", orgForPoliceFilter: "01" },
        { defendantName: "QUINN Harley", orgForPoliceFilter: "01" },
        { defendantName: "KATSU Hideto", orgForPoliceFilter: "01" },
        { defendantName: "LUTHOR Lex", orgForPoliceFilter: "01" }
      ])

      // Assign 17 cases with the group trigger code (Bails, Custody, Orders, Warrants)
      flatten(Object.values(GroupedTriggerCodes)).forEach((triggerCode, index) => {
        const trigger: TestTrigger = {
          triggerId: index,
          triggerCode,
          status: "Unresolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        }

        cy.task("insertTriggers", { caseId: index, triggers: [trigger] })
      })

      // The last 3 cases should not have Bails, Custody, Orders or Warrants trigger code
      const courtCasesIds = [17, 18, 19]
      courtCasesIds.forEach((courtCasesId) => {
        const trigger: TestTrigger = {
          triggerId: courtCasesId,
          triggerCode: TriggerCode.TRPR0017,
          status: "Unresolved",
          createdAt: new Date("2022-07-09T10:22:34.000Z")
        }

        cy.task("insertTriggers", { caseId: courtCasesId, triggers: [trigger] })
      })
    })

    it("shows the group 'Bails' with 4 triggers", () => {
      cy.visit("/bichard")

      cy.get("label[for=bails]").should("have.text", "Bails (4)")
      cy.get("label[for=bails]").click()

      cy.injectAxe()

      cy.checkA11y(undefined, a11yConfig, logAccessibilityViolations)
    })

    it("shows the group 'Custody' with 5 triggers", () => {
      cy.visit("/bichard")

      cy.get("label[for=custody]").should("have.text", "Custody (5)")
    })

    it("shows the group 'Orders' with 6 triggers", () => {
      cy.visit("/bichard")

      cy.get("label[for=orders]").should("have.text", "Orders (6)")
    })

    it("shows the group 'Warrants' with 2 triggers", () => {
      cy.visit("/bichard")

      cy.get("label[for=warrants]").should("have.text", "Warrants (2)")
    })

    it("shows all cases before we filter them", () => {
      cy.visit("/bichard")

      cy.get("tbody").should("have.length", "20")

      // Bails
      cy.get("tbody").contains("WAYNE Bruce")
      cy.get("tbody").contains("GORDON Barbara")
      cy.get("tbody").contains("PENNYWORTH Alfred")
      cy.get("tbody").contains("GRAYSON Richard")
      // Custody
      cy.get("tbody").contains("SAVAGE Pete")
      cy.get("tbody").contains("FALCONE Carmine")
      cy.get("tbody").contains("GORDON James")
      cy.get("tbody").contains("COLSON Gil")
      cy.get("tbody").contains("KYKLE Selina")
      // Orders
      cy.get("tbody").contains("COOPER Harriet")
      cy.get("tbody").contains("REID Britt")
      cy.get("tbody").contains("BENNETT Ethan")
      cy.get("tbody").contains("ROJAS Angel")
      cy.get("tbody").contains("YIN Ellen")
      cy.get("tbody").contains("KARLO Basil")
      // Warrants
      cy.get("tbody").contains("GRAVES Mercy")
      cy.get("tbody").contains("GREY Francis")
      // Other
      cy.get("tbody").contains("QUINN Harley")
      cy.get("tbody").contains("KATSU Hideto")
      cy.get("tbody").contains("LUTHOR Lex")
    })

    it("filters by group 'Bails'", () => {
      cy.visit("/bichard")

      cy.get("input#bails").click()

      cy.get("input#trpr0008 + label").contains("(1)")
      cy.get("input#trpr0010 + label").contains("(1)")
      cy.get("input#trpr0020 + label").contains("(1)")
      cy.get("input#trpr0030 + label").contains("(1)")

      cy.get("button#search").click()

      cy.get("tbody").should("have.length", "4")

      cy.get("tbody").contains("WAYNE Bruce")
      cy.get("tbody").contains("GORDON Barbara")
      cy.get("tbody").contains("PENNYWORTH Alfred")
      cy.get("tbody").contains("GRAYSON Richard")

      cy.get("tbody").contains("QUINN Harley").should("not.exist")
      cy.get("tbody").contains("KATSU Hideto").should("not.exist")
      cy.get("tbody").contains("LUTHOR Lex").should("not.exist")
    })

    it("filters by group 'Bails' and just the first one", () => {
      cy.visit("/bichard")

      cy.get("input#bails").click()

      cy.get("input#trpr0010").click()
      cy.get("input#trpr0010").should("not.be.checked")
      cy.get("input#trpr0020").click()
      cy.get("input#trpr0020").should("not.be.checked")
      cy.get("input#trpr0030").click()
      cy.get("input#trpr0030").should("not.be.checked")

      cy.get("input#bails:indeterminate").should("exist")

      cy.get("button#search").click()

      cy.get("tbody").should("have.length", "1")

      cy.get("tbody").contains("WAYNE Bruce")

      cy.get("tbody").contains("GORDON Barbara").should("not.exist")
      cy.get("tbody").contains("PENNYWORTH Alfred").should("not.exist")
      cy.get("tbody").contains("GRAYSON Richard").should("not.exist")

      cy.get("tbody").contains("QUINN Harley").should("not.exist")
      cy.get("tbody").contains("KATSU Hideto").should("not.exist")
      cy.get("tbody").contains("LUTHOR Lex").should("not.exist")
    })

    it("filters by group 'Custody'", () => {
      cy.visit("/bichard")

      cy.get("input#custody").click()

      cy.get("input#trpr0001 + label").contains("(1)")
      cy.get("input#trpr0005 + label").contains("(1)")
      cy.get("input#trpr0006 + label").contains("(1)")
      cy.get("input#trpr0019 + label").contains("(1)")
      cy.get("input#trpr0021 + label").contains("(1)")

      cy.get("button#search").click()

      cy.get("tbody").should("have.length", "5")

      cy.get("tbody").contains("SAVAGE Pete")
      cy.get("tbody").contains("FALCONE Carmine")
      cy.get("tbody").contains("GORDON James")
      cy.get("tbody").contains("COLSON Gil")
      cy.get("tbody").contains("KYKLE Selina")

      cy.get("tbody").contains("QUINN Harley").should("not.exist")
      cy.get("tbody").contains("KATSU Hideto").should("not.exist")
      cy.get("tbody").contains("LUTHOR Lex").should("not.exist")
    })

    it("filters by group 'Custody' and just the first one", () => {
      cy.visit("/bichard")

      cy.get("input#custody").click()

      cy.get("input#trpr0005").click()
      cy.get("input#trpr0005").should("not.be.checked")
      cy.get("input#trpr0006").click()
      cy.get("input#trpr0006").should("not.be.checked")
      cy.get("input#trpr0019").click()
      cy.get("input#trpr0019").should("not.be.checked")
      cy.get("input#trpr0021").click()
      cy.get("input#trpr0021").should("not.be.checked")

      cy.get("input#custody:indeterminate").should("exist")

      cy.get("button#search").click()

      cy.get("tbody").should("have.length", "1")

      cy.get("tbody").contains("SAVAGE Pete")

      cy.get("tbody").contains("FALCONE Carmine").should("not.exist")
      cy.get("tbody").contains("GORDON James").should("not.exist")
      cy.get("tbody").contains("COLSON Gil").should("not.exist")
      cy.get("tbody").contains("KYKLE Selina").should("not.exist")

      cy.get("tbody").contains("QUINN Harley").should("not.exist")
      cy.get("tbody").contains("KATSU Hideto").should("not.exist")
      cy.get("tbody").contains("LUTHOR Lex").should("not.exist")
    })

    it("filters by group 'Orders'", () => {
      cy.visit("/bichard")

      cy.get("input#orders").click()

      cy.get("input#trpr0003 + label").contains("(1)")
      cy.get("input#trpr0016 + label").contains("(1)")
      cy.get("input#trpr0025 + label").contains("(1)")
      cy.get("input#trpr0026 + label").contains("(1)")
      cy.get("input#trpr0029 + label").contains("(1)")
      cy.get("input#trps0008 + label").contains("(1)")

      cy.get("button#search").click()

      cy.get("tbody").should("have.length", "6")

      cy.get("tbody").contains("COOPER Harriet")
      cy.get("tbody").contains("REID Britt")
      cy.get("tbody").contains("BENNETT Ethan")
      cy.get("tbody").contains("ROJAS Angel")
      cy.get("tbody").contains("YIN Ellen")
      cy.get("tbody").contains("KARLO Basil")

      cy.get("tbody").contains("QUINN Harley").should("not.exist")
      cy.get("tbody").contains("KATSU Hideto").should("not.exist")
      cy.get("tbody").contains("LUTHOR Lex").should("not.exist")
    })

    it("filters by group 'Orders' and just the first one", () => {
      cy.visit("/bichard")

      cy.get("input#orders").click()

      cy.get("input#trpr0016").click()
      cy.get("input#trpr0016").should("not.be.checked")

      cy.get("input#trpr0025").click()
      cy.get("input#trpr0025").should("not.be.checked")

      cy.get("input#trpr0026").click()
      cy.get("input#trpr0026").should("not.be.checked")

      cy.get("input#trpr0029").click()
      cy.get("input#trpr0029").should("not.be.checked")

      cy.get("input#trps0008").click()
      cy.get("input#trps0008").should("not.be.checked")

      cy.get("input#orders:indeterminate").should("exist")

      cy.get("button#search").click()

      cy.get("tbody").should("have.length", "1")

      cy.get("tbody").contains("COOPER Harriet")

      cy.get("tbody").contains("REID Britt").should("not.exist")
      cy.get("tbody").contains("BENNETT Ethan").should("not.exist")
      cy.get("tbody").contains("ROJAS Angel").should("not.exist")
      cy.get("tbody").contains("YIN Ellen").should("not.exist")
      cy.get("tbody").contains("KARLO Basil").should("not.exist")

      cy.get("tbody").contains("QUINN Harley").should("not.exist")
      cy.get("tbody").contains("KATSU Hideto").should("not.exist")
      cy.get("tbody").contains("LUTHOR Lex").should("not.exist")
    })

    it("filters by group 'Warrants'", () => {
      cy.visit("/bichard")

      cy.get("input#warrants").click()

      cy.get("input#trpr0002 + label").contains("(1)")
      cy.get("input#trpr0012 + label").contains("(1)")

      cy.get("button#search").click()

      cy.get("tbody").should("have.length", "2")

      cy.get("tbody").contains("GRAVES Mercy")
      cy.get("tbody").contains("GREY Francis")

      cy.get("tbody").contains("QUINN Harley").should("not.exist")
      cy.get("tbody").contains("KATSU Hideto").should("not.exist")
      cy.get("tbody").contains("LUTHOR Lex").should("not.exist")
    })

    it("filters by group 'Warrants' and just the first one", () => {
      cy.visit("/bichard")

      cy.get("input#warrants").click()

      cy.get("input#trpr0012").click()
      cy.get("input#trpr0012").should("not.be.checked")

      cy.get("input#warrants:indeterminate").should("exist")

      cy.get("button#search").click()

      cy.get("tbody").should("have.length", "1")

      cy.get("tbody").contains("GRAVES Mercy")

      cy.get("tbody").contains("GREY Francis").should("not.exist")

      cy.get("tbody").contains("QUINN Harley").should("not.exist")
      cy.get("tbody").contains("KATSU Hideto").should("not.exist")
      cy.get("tbody").contains("LUTHOR Lex").should("not.exist")
    })

    it("filters by all trigger groups", () => {
      cy.visit("/bichard")

      cy.get("input#bails").click()
      cy.get("input#custody").click()
      cy.get("input#orders").click()
      cy.get("input#warrants").click()

      cy.get("button#search").click()

      cy.get("tbody").should("have.length", "17")

      // Bails
      cy.get("tbody").contains("WAYNE Bruce")
      cy.get("tbody").contains("GORDON Barbara")
      cy.get("tbody").contains("PENNYWORTH Alfred")
      cy.get("tbody").contains("GRAYSON Richard")
      // Custody
      cy.get("tbody").contains("SAVAGE Pete")
      cy.get("tbody").contains("FALCONE Carmine")
      cy.get("tbody").contains("GORDON James")
      cy.get("tbody").contains("COLSON Gil")
      cy.get("tbody").contains("KYKLE Selina")
      // Orders
      cy.get("tbody").contains("COOPER Harriet")
      cy.get("tbody").contains("REID Britt")
      cy.get("tbody").contains("BENNETT Ethan")
      cy.get("tbody").contains("ROJAS Angel")
      cy.get("tbody").contains("YIN Ellen")
      cy.get("tbody").contains("KARLO Basil")
      // Warrants
      cy.get("tbody").contains("GRAVES Mercy")
      cy.get("tbody").contains("GREY Francis")
      // Other
      cy.get("tbody").contains("QUINN Harley").should("not.exist")
      cy.get("tbody").contains("KATSU Hideto").should("not.exist")
      cy.get("tbody").contains("LUTHOR Lex").should("not.exist")
    })
  })
})

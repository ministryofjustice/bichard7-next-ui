import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import { expect } from "@storybook/jest"
import createDummyAho from "../../../test/helpers/createDummyAho"
import HearingOutcome from "./HearingOutcome"

export default {
  title: "Components/HearingOutcome",
  component: HearingOutcome
} as ComponentMeta<typeof HearingOutcome>

export const AHO: ComponentStory<typeof HearingOutcome> = () => {
  const aho = createDummyAho()
  return <HearingOutcome aho={aho} />
}

// it("should load the hearing outcome details for the case that this user can see", () => {
//   cy.task("insertCourtCasesWithOrgCodes", ["01"])
//   const triggers: TestTrigger[] = [
//     {
//       triggerId: 0,
//       triggerCode: "TRPR0001",
//       status: "Unresolved",
//       createdAt: new Date("2022-07-09T10:22:34.000Z")
//     }
//   ]
//   cy.task("insertTriggers", { caseId: 0, triggers })
//   cy.visit("/court-cases/0")

//   // Hearing Outcome Table
//   // Hearing Tab
//   cy.get("ul").eq(1).find("li > a").eq(0).should("have.text", "Hearing")
//   cy.get("#0").find("table > tbody > tr > td").first().should("have.text", "Court location")
//   cy.get("#0").find("table > tbody > tr > td").eq(1).should("have.text", "B41ME00")

//   // Case Tab
//   cy.get("ul").eq(1).find("li > a").eq(1).should("have.text", "Case")
//   cy.get("ul").eq(1).find("li > a").eq(1).click()
//   cy.get("#1").find("table > tbody > tr > td").first().should("have.text", "PTIURN")
//   cy.get("#1").find("table > tbody > tr > td").eq(1).should("have.text", "41BP0510007")

//   // Defendant Tab
//   cy.get("ul").eq(1).find("li > a").eq(2).should("have.text", "Defendant")
//   cy.get("ul").eq(1).find("li > a").eq(2).click()
//   cy.get("#2").find("table > tbody > tr > td").first().should("have.text", "ASN")
//   cy.get("#2").find("table > tbody > tr > td").eq(1).should("have.text", "9625UC0000000118191Z")

//   // Offences
//   cy.get("ul").eq(1).find("li > a").eq(3).should("have.text", "Offences")
//   cy.get("ul").eq(1).find("li > a").eq(3).click()
//   cy.get("#3").find("table > tbody > tr > td").first().should("have.text", "1")
//   cy.get("#3")
//     .find("table > tbody > tr > td")
//     .last()
//     .should("have.text", "Burglary other than dwelling with intent to steal")
// })

AHO.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)

  const hearingTable = canvas.getByRole("table", { name: "Hearing" })
  expect(hearingTable).toBeInTheDocument()
  expect(within(hearingTable).getByText("Court location")).toBeInTheDocument()
  expect(within(hearingTable).getByText("01234567")).toBeInTheDocument()

  const caseTable = canvas.getByRole("table", { name: "Case" })
  expect(caseTable).toBeInTheDocument()
  expect(within(caseTable).getByText("PTIURN")).toBeInTheDocument()
  expect(within(caseTable).getByText("123456")).toBeInTheDocument()

  const defendantTable = canvas.getByRole("table", { name: "Defendant" })
  expect(defendantTable).toBeInTheDocument()
  expect(within(defendantTable).getByText("ASN")).toBeInTheDocument()
  expect(within(defendantTable).getByText("original_value")).toBeInTheDocument()

  const offenceTable = canvas.getByRole("table", { name: "Offences" })
  expect(offenceTable).toBeInTheDocument()
  expect(within(offenceTable).getByText("1")).toBeInTheDocument()
  expect(within(offenceTable).getByText("Crime")).toBeInTheDocument()
}

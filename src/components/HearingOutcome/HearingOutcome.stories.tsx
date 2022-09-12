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

  // const blah = canvas.getAllBy

  expect(canvas.getByText("Court location")).toBeInTheDocument()
  expect(canvas.getByText("01234567")).toBeInTheDocument()

  expect(canvas.getByText("PTIURN")).toBeInTheDocument()
  expect(canvas.getByText("123456")).toBeInTheDocument()

  expect(canvas.getByText("ASN")).toBeInTheDocument()
  expect(canvas.getByText("original_value")).toBeInTheDocument()
}

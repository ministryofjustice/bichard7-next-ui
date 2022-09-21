import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import { expect } from "@storybook/jest"
import createDummyAho from "../../../test/helpers/createDummyAho"
import HearingOutcome from "./HearingOutcome"

export default {
  title: "Components/HearingOutcome",
  component: HearingOutcome
} as ComponentMeta<typeof HearingOutcome>

export const HearingOutcomeStory: ComponentStory<typeof HearingOutcome> = () => {
  const aho = createDummyAho()
  return <HearingOutcome aho={aho} courtCaseId={79057} />
}

HearingOutcomeStory.play = ({ canvasElement }) => {
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

  expect(canvas.getByRole("button", { name: "Resubmit" })).toBeInTheDocument()
}

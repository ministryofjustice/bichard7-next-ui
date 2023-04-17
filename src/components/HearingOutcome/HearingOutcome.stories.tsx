import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import createDummyAho from "../../../test/helpers/createDummyAho"
import HearingOutcome from "./HearingOutcome"
import { expect } from "@storybook/jest"

export default {
  title: "Components/HearingOutcome",
  component: HearingOutcome
} as ComponentMeta<typeof HearingOutcome>

export const HearingOutcomeStory: ComponentStory<typeof HearingOutcome> = () => {
  const aho = createDummyAho()
  return <HearingOutcome aho={aho} courtCaseId={79057} />
}

HearingOutcomeStory.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)

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

  const offenceTitles = within(offenceTable).getAllByText("Crime")
  expect(offenceTitles).toHaveLength(2)

  const button = canvas.getByRole("button", { name: "Resubmit" })
  expect(button).toBeInTheDocument()
}

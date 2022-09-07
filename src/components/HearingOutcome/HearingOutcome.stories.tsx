import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import { expect } from "@storybook/jest"
import createDummyAho from "../../../test/helpers/createDummyAho"
import HearingOutcome from "./HearingOutcome"

export default {
  title: "Components/HearingOutcome",
  component: HearingOutcome
} as ComponentMeta<typeof HearingOutcome>

export const Primary: ComponentStory<typeof HearingOutcome> = () => {
  const aho = createDummyAho()
  return <HearingOutcome aho={aho} />
}

Primary.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)
  expect(canvas.getByText("Hearing")).toBeInTheDocument()
  expect(canvas.getByText("Case")).toBeInTheDocument()
  expect(canvas.getByText("Defendant")).toBeInTheDocument()
  expect(canvas.getByText("Offences")).toBeInTheDocument()
}

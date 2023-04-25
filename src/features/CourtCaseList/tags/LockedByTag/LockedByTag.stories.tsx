import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import { expect } from "@storybook/jest"
import LockedByTag from "./LockedByTag"

export default {
  title: "Features/CourtCaseList/LockedByTag",
  component: LockedByTag
} as ComponentMeta<typeof LockedByTag>

export const NotLocked: ComponentStory<typeof LockedByTag> = () => <LockedByTag />
NotLocked.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)
  expect(canvas.queryByText("Bichard01")).toBeNull()
}

export const Locked: ComponentStory<typeof LockedByTag> = () => <LockedByTag lockedBy="Bichard01" />
Locked.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)
  expect(canvas.getByText("Bichard01")).toBeInTheDocument()
}

export const LongName: ComponentStory<typeof LockedByTag> = () => (
  <LockedByTag lockedBy="A Really Really Really Really Long Name" />
)
LongName.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)
  expect(canvas.getByText("A Really Really Really Really Long Name")).toBeInTheDocument()
}

export const WithUnlockPath: ComponentStory<typeof LockedByTag> = () => (
  <LockedByTag lockedBy="Some Name" unlockPath="/some/path" />
)
WithUnlockPath.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const expectedUnlockButton = await canvas.findByRole("button")
  expect(expectedUnlockButton).toHaveTextContent("Some Name")
}

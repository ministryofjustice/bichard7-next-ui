import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import { expect } from "@storybook/jest"
import ResolvedTag from "./ResolvedTag"

export default {
  title: "Features/CourtCaseList/ResolvedTag",
  component: ResolvedTag
} as ComponentMeta<typeof ResolvedTag>

export const NotResolved: ComponentStory<typeof ResolvedTag> = () => <ResolvedTag isResolved={false} />
NotResolved.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.queryByText("Resolved")).toBeNull()
}

export const Resolved: ComponentStory<typeof ResolvedTag> = () => <ResolvedTag isResolved={true} />
Resolved.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("Resolved")).toBeInTheDocument()
}

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
NotResolved.parameters = {
  design: [
    {
      name: "Resolved tag",
      type: "figma",
      url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A7033"
    },
    {
      name: "Entire table",
      type: "figma",
      url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A5282"
    }
  ]
}

export const Resolved: ComponentStory<typeof ResolvedTag> = () => <ResolvedTag isResolved={true} />
Resolved.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("Resolved")).toBeInTheDocument()
}
Resolved.parameters = {
  design: [
    {
      name: "Resolved tag",
      type: "figma",
      url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A7033"
    },
    {
      name: "Entire table",
      type: "figma",
      url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A5282"
    }
  ]
}

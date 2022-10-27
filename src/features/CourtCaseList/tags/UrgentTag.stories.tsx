import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import { expect } from "@storybook/jest"
import UrgentTag from "./UrgentTag"

export default {
  title: "Features/CourtCaseList/UrgentTag",
  component: UrgentTag
} as ComponentMeta<typeof UrgentTag>

export const NotUrgent: ComponentStory<typeof UrgentTag> = () => <UrgentTag isUrgent={false} />
NotUrgent.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.queryByText("Urgent")).toBeNull()
}
NotUrgent.parameters = {
  design: [
    {
      name: "Urgent tag",
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

export const Urgent: ComponentStory<typeof UrgentTag> = () => <UrgentTag isUrgent={true} />
Urgent.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("Urgent")).toBeInTheDocument()
}
Urgent.parameters = {
  design: [
    {
      name: "Urgent tag",
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

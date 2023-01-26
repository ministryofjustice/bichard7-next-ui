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
NotLocked.parameters = {
  design: [
    {
      name: "Locked by tag",
      type: "figma",
      url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A5344"
    },
    {
      name: "Entire table",
      type: "figma",
      url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A5282"
    }
  ]
}

export const Locked: ComponentStory<typeof LockedByTag> = () => <LockedByTag lockedBy="Bichard01" />
Locked.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)
  expect(canvas.getByText("Bichard01")).toBeInTheDocument()
}
Locked.parameters = {
  design: [
    {
      name: "Locked by tag",
      type: "figma",
      url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A5344"
    },
    {
      name: "Entire table",
      type: "figma",
      url: "https://www.figma.com/file/LHxGJpfSjuTczcqrFzUQNc/06_B7_22-Handover-hifi-case-list-screens?node-id=5%3A5282"
    }
  ]
}

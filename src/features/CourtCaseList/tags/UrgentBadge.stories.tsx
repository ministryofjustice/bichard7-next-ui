import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import { expect } from "@storybook/jest"
import UrgentBadge from "./UrgentBadge"

export default {
  title: "Features/CourtCaseList/UrgentBadge",
  component: UrgentBadge
} as ComponentMeta<typeof UrgentBadge>

export const CaseUnlocked: ComponentStory<typeof UrgentBadge> = () => <UrgentBadge isUrgent={true} />
CaseUnlocked.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)
  expect(canvas.getByText("Urgent")).toBeInTheDocument()
}

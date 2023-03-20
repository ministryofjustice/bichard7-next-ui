import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import { expect } from "@storybook/jest"
import CaseUnlockedTag from "./CaseUnlockedTag"

export default {
  title: "Features/CourtCaseList/CaseUnlockedTag",
  component: CaseUnlockedTag
} as ComponentMeta<typeof CaseUnlockedTag>

export const CaseUnlocked: ComponentStory<typeof CaseUnlockedTag> = () => <CaseUnlockedTag isCaseUnlocked={true} />
CaseUnlocked.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)
  expect(canvas.getByText("Case unlocked")).toBeInTheDocument()
}

import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import { expect } from "@storybook/jest"
import CaseUnlockedTag from "./CaseUnlockedTag"

export default {
  title: "Features/CourtCaseList/CaseUnlockedTag",
  component: CaseUnlockedTag
} as ComponentMeta<typeof CaseUnlockedTag>

export const CaseNotUnlocked: ComponentStory<typeof CaseUnlockedTag> = () => <CaseUnlockedTag isCaseUnlocked={false} />
CaseNotUnlocked.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.queryByText("Case unlocked")).toBeNull()
}

export const CaseUnlocked: ComponentStory<typeof CaseUnlockedTag> = () => <CaseUnlockedTag isCaseUnlocked={true} />
CaseUnlocked.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("Case unlocked")).toBeInTheDocument()
}

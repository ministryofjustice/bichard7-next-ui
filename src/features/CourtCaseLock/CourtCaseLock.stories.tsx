import { expect } from "@storybook/jest"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import CourtCase from "services/entities/CourtCase"
import CourtCaseLock from "./CourtCaseLock"

export default {
  title: "Features/CourtCase/Lock",
  component: CourtCaseLock
} as ComponentMeta<typeof CourtCaseLock>

const courtCase = {
  errorLockedById: "User",
  triggerLockedById: "User"
} as unknown as CourtCase

export const Lock: ComponentStory<typeof CourtCaseLock> = () => <CourtCaseLock courtCase={courtCase} />

Lock.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  await expect(canvas.getByText("Error locked by: " + courtCase.errorLockedById!)).toBeInTheDocument()
  await expect(canvas.getByText("Trigger locked by: " + courtCase.triggerLockedById!)).toBeInTheDocument()
  /* eslint-enable @typescript-eslint/no-non-null-assertion */
}

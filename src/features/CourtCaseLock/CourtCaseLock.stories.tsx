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

export const Lock: ComponentStory<typeof CourtCaseLock> = () => (
  <CourtCaseLock courtCase={courtCase} lockedByAnotherUser={false} />
)

Lock.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("Error locked by: " + courtCase.errorLockedByUsername ?? "")).toBeInTheDocument()
  await expect(canvas.getByText("Trigger locked by: " + courtCase.triggerLockedByUsername ?? "")).toBeInTheDocument()
}

export const LockedByAnotherUser: ComponentStory<typeof CourtCaseLock> = () => (
  <CourtCaseLock courtCase={courtCase} lockedByAnotherUser={true} />
)

LockedByAnotherUser.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("Case locked by another user")).toBeInTheDocument()
  await expect(canvas.getByText("Error locked by: " + courtCase.errorLockedByUsername ?? "")).toBeInTheDocument()
  await expect(canvas.getByText("Trigger locked by: " + courtCase.triggerLockedByUsername ?? "")).toBeInTheDocument()
}

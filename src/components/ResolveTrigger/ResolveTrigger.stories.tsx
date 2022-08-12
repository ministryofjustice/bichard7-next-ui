import { expect } from "@storybook/jest"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import Trigger from "services/entities/Trigger"
import ResolveTrigger from "./ResolveTrigger"

export default {
  title: "Components/ResolveTrigger",
  component: ResolveTrigger
} as ComponentMeta<typeof ResolveTrigger>

const unresolvedTriggerEntity = {
  triggerId: 0,
  resolvedAt: undefined,
  resolvedBy: undefined
} as Trigger
export const UnresolvedTrigger: ComponentStory<typeof ResolveTrigger> = () => (
  <ResolveTrigger trigger={unresolvedTriggerEntity} />
)
UnresolvedTrigger.story = {
  parameters: {
    nextRouter: {
      basePath: "/bichard"
    }
  }
}

UnresolvedTrigger.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.queryByText("Resolve trigger")).toBeInTheDocument()
  await expect(canvas.queryByText("Resolve trigger")).toBeVisible()
  await expect(canvas.queryByText("Resolve trigger")).not.toHaveAttribute("disabled")
}

const resolvedTriggerEntity = {
  triggerId: 0,
  resolvedAt: new Date(),
  resolvedBy: "triggerResolver01"
} as Trigger
export const ResolvedTrigger: ComponentStory<typeof ResolveTrigger> = () => (
  <ResolveTrigger trigger={resolvedTriggerEntity} />
)
ResolvedTrigger.story = {
  parameters: {
    nextRouter: {
      basePath: "/bichard"
    }
  }
}

ResolvedTrigger.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.queryByText("Resolve trigger")).toBeInTheDocument()
  await expect(canvas.queryByText("Resolve trigger")).toBeVisible()
  await expect(canvas.queryByText("Resolve trigger")).toHaveAttribute("disabled")
}

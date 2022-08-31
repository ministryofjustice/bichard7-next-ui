import { expect } from "@storybook/jest"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import User from "services/entities/User"
import FeatureFlag from "./FeatureFlag"

export default {
  title: "Components/FeatureFlag",
  component: FeatureFlag
} as ComponentMeta<typeof FeatureFlag>

export const EnabledFeature: ComponentStory<typeof FeatureFlag> = () => (
  <FeatureFlag featureFlags={{ "test-feature": true }} featureName="test-feature">
    {"This feature is enabled with a flag"}
  </FeatureFlag>
)

EnabledFeature.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)
  expect(canvas.queryByText("This feature is enabled with a flag")).toBeInTheDocument()
}

export const DisabledFeature: ComponentStory<typeof FeatureFlag> = () => (
  <FeatureFlag featureFlags={{ "test-feature": false }} featureName="test-feature">
    {"This feature is enabled with a flag"}
  </FeatureFlag>
)

DisabledFeature.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)
  expect(canvas.queryByText("This feature is enabled with a flag")).not.toBeInTheDocument()
}

export const NoFlags: ComponentStory<typeof FeatureFlag> = () => (
  <FeatureFlag featureFlags={{}} featureName="test-feature">
    {"This feature is enabled with a flag"}
  </FeatureFlag>
)

NoFlags.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)
  expect(canvas.queryByText("This feature is enabled with a flag")).not.toBeInTheDocument()
}

export const UndefinedFlags: ComponentStory<typeof FeatureFlag> = () => (
  <FeatureFlag featureFlags={undefined} featureName="test-feature">
    {"This feature is enabled with a flag"}
  </FeatureFlag>
)

UndefinedFlags.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)
  expect(canvas.queryByText("This feature is enabled with a flag")).not.toBeInTheDocument()
}

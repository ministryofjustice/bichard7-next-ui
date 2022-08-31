import { expect } from "@storybook/jest"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import User from "services/entities/User"
import FeatureFlag from "./FeatureFlag"

export default {
  title: "Components/FeatureFlag",
  component: FeatureFlag
} as ComponentMeta<typeof FeatureFlag>

const userWithAccess = new User()
userWithAccess.featureFlags = { "test-feature": true }

export const EnabledFeature: ComponentStory<typeof FeatureFlag> = () => (
  <FeatureFlag user={userWithAccess} featureName="test-feature">
    {"This feature is enabled with a flag"}
  </FeatureFlag>
)

EnabledFeature.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)
  expect(canvas.queryByText("This feature is enabled with a flag")).toBeInTheDocument()
}

const userWithoutAccess = new User()
userWithAccess.featureFlags = { "test-feature": true }

export const DisabledFeature: ComponentStory<typeof FeatureFlag> = () => (
  <FeatureFlag user={userWithoutAccess} featureName="test-feature">
    {"This feature is enabled with a flag"}
  </FeatureFlag>
)

DisabledFeature.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)
  expect(canvas.queryByText("This feature is enabled with a flag")).not.toBeInTheDocument()
}

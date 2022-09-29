import { expect } from "@storybook/jest"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import { ResultFilter } from "./ResultFilter"
import { axe, toHaveNoViolations } from "jest-axe"
expect.extend(toHaveNoViolations)

export default {
  title: "Components/ResultFilter",
  component: ResultFilter
} as ComponentMeta<typeof ResultFilter>

export const WithoutInitialSelection: ComponentStory<typeof ResultFilter> = () => (
  <div data-testid="result-filter-component">
    <ResultFilter initialSelection={undefined} />
  </div>
)

WithoutInitialSelection.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)

  expect(canvas.queryByText("Show all")).toBeInTheDocument()

  const resultFilterComponent = canvas.getByTestId("result-filter-component")
  expect(await axe(resultFilterComponent)).toHaveNoViolations()
}

export const WhenTriggerSelected: ComponentStory<typeof ResultFilter> = () => (
  <ResultFilter initialSelection="triggers" />
)

WhenTriggerSelected.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)
  expect(canvas.queryByText("Show only cases with triggers")).toBeInTheDocument()
}

export const WhenExceptionsSelected: ComponentStory<typeof ResultFilter> = () => (
  <ResultFilter initialSelection="exceptions" />
)

WhenExceptionsSelected.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)
  expect(canvas.queryByText("Show only cases with exceptions")).toBeInTheDocument()
}

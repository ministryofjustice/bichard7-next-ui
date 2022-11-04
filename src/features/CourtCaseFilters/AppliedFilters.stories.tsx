import { ComponentMeta, ComponentStory } from "@storybook/react"
import AppliedFilters from "./AppliedFilters"
import { within } from "@storybook/testing-library"
import { expect } from "@storybook/jest"
import { axe } from "jest-axe"

export default {
  title: "Features/CourtCaseFilters/AppliedFilters",
  component: AppliedFilters
} as ComponentMeta<typeof AppliedFilters>

export const ShouldBeAccessible: ComponentStory<typeof AppliedFilters> = () => (
  <div data-testid="applied-filters">
    <AppliedFilters courtCaseTypes={["Exceptions", "Triggers"]} keywords={["Test keyword"]} urgency={true} />
  </div>
)

ShouldBeAccessible.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)

  const pagination = canvas.getByTestId("applied-filters")
  expect(await axe(pagination)).toHaveNoViolations()
}

export const WhenThereAreFiltersApplied: ComponentStory<typeof AppliedFilters> = () => (
  <AppliedFilters courtCaseTypes={["Exceptions", "Triggers"]} keywords={["Test keyword"]} urgency={true} />
)

WhenThereAreFiltersApplied.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)
  expect(canvas.queryByText("Filters applied:")).toBeInTheDocument()
  expect(canvas.queryByText("Exceptions")).toBeInTheDocument()
  expect(canvas.queryByText("Triggers")).toBeInTheDocument()
  expect(canvas.queryByText("Test keyword")).toBeInTheDocument()
  expect(canvas.queryByText("Urgent")).toBeInTheDocument()
  expect(canvas.queryByText("Clear filters")).toBeInTheDocument()
}

export const WhenThereAreNoFiltersApplied: ComponentStory<typeof AppliedFilters> = () => (
  <AppliedFilters courtCaseTypes={[]} keywords={[]} />
)

WhenThereAreNoFiltersApplied.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)
  expect(canvas.queryByText("Filters applied:")).not.toBeInTheDocument()
  expect(canvas.queryByText("Exceptions")).not.toBeInTheDocument()
  expect(canvas.queryByText("Triggers")).not.toBeInTheDocument()
  expect(canvas.queryByText("Test keyword")).not.toBeInTheDocument()
  expect(canvas.queryByText("Urgent")).not.toBeInTheDocument()
  expect(canvas.queryByText("Clear filters")).not.toBeInTheDocument()
}

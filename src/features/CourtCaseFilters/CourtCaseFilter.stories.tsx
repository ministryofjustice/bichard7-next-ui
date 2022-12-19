import { ComponentMeta, ComponentStory } from "@storybook/react"
import CourtCaseFilter from "./CourtCaseFilter"
import { within } from "@storybook/testing-library"
import { expect } from "@storybook/jest"
import { axe } from "jest-axe"

export default {
  title: "Features/CourtCaseFilters/CourtCaseFilter",
  component: CourtCaseFilter
} as ComponentMeta<typeof CourtCaseFilter>

export const ShouldBeAccessible: ComponentStory<typeof CourtCaseFilter> = () => (
  <div data-testid="filters">
    <CourtCaseFilter />
  </div>
)

ShouldBeAccessible.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)

  const pagination = canvas.getByTestId("filters")
  expect(await axe(pagination)).toHaveNoViolations()
}

export const WhenThereAreFiltersApplied: ComponentStory<typeof CourtCaseFilter> = () => <CourtCaseFilter />

WhenThereAreFiltersApplied.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)
  expect(canvas.queryByText("Filter")).toBeInTheDocument()
  expect(canvas.queryByText("Selected filters")).toBeInTheDocument()
  expect(canvas.queryByText("Apply filters")).toBeInTheDocument()
  expect(canvas.queryByText("Keywords")).toBeInTheDocument()
  expect(canvas.queryByText("Defendent name, Court name, Reason, PTIURN")).toBeInTheDocument()
  expect(canvas.queryByText("Urgency")).toBeInTheDocument()
}

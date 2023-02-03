import { expect } from "@storybook/jest"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import PaginationResults from "./PaginationResults"

export default {
  title: "Components/Pagination/PaginationResults",
  component: PaginationResults
} as ComponentMeta<typeof PaginationResults>

export const OnePage: ComponentStory<typeof PaginationResults> = () => (
  <div data-testid="pagination-results">
    <PaginationResults pageNum={1} totalCases={5} casesPerPage={10} />
  </div>
)
OnePage.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByTestId("pagination-results")).toHaveTextContent("Showing 1 to 5 of 5 cases")
}

export const PageOneOfMany: ComponentStory<typeof PaginationResults> = () => (
  <div data-testid="pagination-results">
    <PaginationResults pageNum={1} totalCases={42} casesPerPage={10} />
  </div>
)
PageOneOfMany.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByTestId("pagination-results")).toHaveTextContent("Showing 1 to 10 of 42 cases")
}

export const MidRange: ComponentStory<typeof PaginationResults> = () => (
  <div data-testid="pagination-results">
    <PaginationResults pageNum={3} totalCases={42} casesPerPage={10} />
  </div>
)
MidRange.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByTestId("pagination-results")).toHaveTextContent("Showing 21 to 30 of 42 cases")
}

export const LastPageFull: ComponentStory<typeof PaginationResults> = () => (
  <div data-testid="pagination-results">
    <PaginationResults pageNum={5} totalCases={50} casesPerPage={10} />
  </div>
)
LastPageFull.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByTestId("pagination-results")).toHaveTextContent("Showing 41 to 50 of 50 cases")
}

export const LastPagePartial: ComponentStory<typeof PaginationResults> = () => (
  <div data-testid="pagination-results">
    <PaginationResults pageNum={5} totalCases={42} casesPerPage={10} />
  </div>
)
LastPagePartial.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByTestId("pagination-results")).toHaveTextContent("Showing 41 to 42 of 42 cases")
}

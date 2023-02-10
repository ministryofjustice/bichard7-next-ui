import { expect } from "@storybook/jest"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import PaginationNavigation from "./PaginationNavigation"

export default {
  title: "Components/Pagination/PaginationNavigation",
  component: PaginationNavigation
} as ComponentMeta<typeof PaginationNavigation>

export const OnePage: ComponentStory<typeof PaginationNavigation> = () => (
  <div data-testid="pagination-navigation">
    <PaginationNavigation pageNum={1} totalPages={1} />
  </div>
)
OnePage.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByTestId("pagination-navigation").querySelectorAll("li")).toHaveLength(0)
}

export const PageOneOfTen: ComponentStory<typeof PaginationNavigation> = () => (
  <div data-testid="pagination-navigation">
    <PaginationNavigation pageNum={1} totalPages={10} />
  </div>
)
PageOneOfTen.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.queryByText("Previous")).not.toBeInTheDocument()
  await expect(canvas.getByText("1")).toBeInTheDocument()
  await expect(canvas.getByLabelText("Page 2 of 10")).toBeInTheDocument()
  await expect(canvas.getByLabelText("Page 10 of 10")).toBeInTheDocument()
  await expect(
    canvas.getByTestId("pagination-navigation").querySelectorAll(".moj-pagination__item--dots")
  ).toHaveLength(1)
  await expect(canvas.getByText("Next")).toBeInTheDocument()
}

export const PageTwoOfTen: ComponentStory<typeof PaginationNavigation> = () => (
  <div data-testid="pagination-navigation">
    <PaginationNavigation pageNum={2} totalPages={10} />
  </div>
)
PageTwoOfTen.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("Previous")).toBeInTheDocument()
  await expect(canvas.getByLabelText("Page 1 of 10")).toBeInTheDocument()
  await expect(canvas.getByText("2")).toBeInTheDocument()
  await expect(canvas.getByLabelText("Page 3 of 10")).toBeInTheDocument()
  await expect(
    canvas.getByTestId("pagination-navigation").querySelector(".moj-pagination__item--dots")
  ).toBeInTheDocument()
  await expect(canvas.getByLabelText("Page 10 of 10")).toBeInTheDocument()
  await expect(canvas.getByText("Next")).toBeInTheDocument()
}

export const PageThreeOfTen: ComponentStory<typeof PaginationNavigation> = () => (
  <div data-testid="pagination-navigation">
    <PaginationNavigation pageNum={3} totalPages={10} />
  </div>
)
PageThreeOfTen.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("Previous")).toBeInTheDocument()
  await expect(canvas.getByLabelText("Page 1 of 10")).toBeInTheDocument()
  await expect(canvas.getByLabelText("Page 2 of 10")).toBeInTheDocument()
  await expect(canvas.getByText("3")).toBeInTheDocument()
  await expect(canvas.getByLabelText("Page 4 of 10")).toBeInTheDocument()
  await expect(
    canvas.getByTestId("pagination-navigation").querySelectorAll(".moj-pagination__item--dots")
  ).toHaveLength(1)
  await expect(canvas.getByLabelText("Page 10 of 10")).toBeInTheDocument()
  await expect(canvas.getByText("Next")).toBeInTheDocument()
}

export const PageFiveOfTen: ComponentStory<typeof PaginationNavigation> = () => (
  <div data-testid="pagination-navigation">
    <PaginationNavigation pageNum={5} totalPages={10} />
  </div>
)
PageFiveOfTen.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("Previous")).toBeInTheDocument()
  await expect(canvas.getByLabelText("Page 1 of 10")).toBeInTheDocument()
  await expect(
    canvas.getByTestId("pagination-navigation").querySelectorAll(".moj-pagination__item--dots")
  ).toHaveLength(2)
  await expect(canvas.getByLabelText("Page 4 of 10")).toBeInTheDocument()
  await expect(canvas.getByText("5")).toBeInTheDocument()
  await expect(canvas.getByLabelText("Page 6 of 10")).toBeInTheDocument()
  await expect(canvas.getByLabelText("Page 10 of 10")).toBeInTheDocument()
  await expect(canvas.getByText("Next")).toBeInTheDocument()
}

export const PageEightOfTen: ComponentStory<typeof PaginationNavigation> = () => (
  <div data-testid="pagination-navigation">
    <PaginationNavigation pageNum={8} totalPages={10} />
  </div>
)
PageEightOfTen.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("Previous")).toBeInTheDocument()
  await expect(canvas.getByLabelText("Page 1 of 10")).toBeInTheDocument()
  await expect(
    canvas.getByTestId("pagination-navigation").querySelectorAll(".moj-pagination__item--dots")
  ).toHaveLength(1)
  await expect(canvas.getByLabelText("Page 7 of 10")).toBeInTheDocument()
  await expect(canvas.getByText("8")).toBeInTheDocument()
  await expect(canvas.getByLabelText("Page 9 of 10")).toBeInTheDocument()
  await expect(canvas.getByLabelText("Page 10 of 10")).toBeInTheDocument()
  await expect(canvas.getByText("Next")).toBeInTheDocument()
}

export const PageNineOfTen: ComponentStory<typeof PaginationNavigation> = () => (
  <div data-testid="pagination-navigation">
    <PaginationNavigation pageNum={9} totalPages={10} />
  </div>
)
PageNineOfTen.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("Previous")).toBeInTheDocument()
  await expect(canvas.getByLabelText("Page 1 of 10")).toBeInTheDocument()
  await expect(
    canvas.getByTestId("pagination-navigation").querySelectorAll(".moj-pagination__item--dots")
  ).toHaveLength(1)
  await expect(canvas.getByLabelText("Page 8 of 10")).toBeInTheDocument()
  await expect(canvas.getByText("9")).toBeInTheDocument()
  await expect(canvas.getByLabelText("Page 10 of 10")).toBeInTheDocument()
  await expect(canvas.getByText("Next")).toBeInTheDocument()
}

export const PageTenOfTen: ComponentStory<typeof PaginationNavigation> = () => (
  <div data-testid="pagination-navigation">
    <PaginationNavigation pageNum={10} totalPages={10} />
  </div>
)
PageTenOfTen.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("Previous")).toBeInTheDocument()
  await expect(canvas.getByLabelText("Page 1 of 10")).toBeInTheDocument()
  await expect(
    canvas.getByTestId("pagination-navigation").querySelectorAll(".moj-pagination__item--dots")
  ).toHaveLength(1)
  await expect(canvas.getByLabelText("Page 9 of 10")).toBeInTheDocument()
  await expect(canvas.getByText("10")).toBeInTheDocument()
  await expect(canvas.queryByText("Next")).not.toBeInTheDocument()
}

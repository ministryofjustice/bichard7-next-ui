import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import { axe } from "jest-axe"
import expect from "../../../test/utils/storybook/expect"
import Pagination from "./Pagination"

export default {
  title: "Components/Pagination",
  component: Pagination
} as ComponentMeta<typeof Pagination>

export const PageOneOfTen: ComponentStory<typeof Pagination> = () => (
  <Pagination pageNum={1} casesPerPage={10} totalCases={100} />
)

PageOneOfTen.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.queryByText("Previous")).not.toBeInTheDocument()
  await expect(canvas.getByText("Next")).toBeInTheDocument()
  await expect(canvas.getByLabelText("Page 2 of 10")).toBeInTheDocument()
}

export const PageFiveOfTen: ComponentStory<typeof Pagination> = () => (
  <Pagination pageNum={5} casesPerPage={10} totalCases={100} />
)

PageFiveOfTen.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("Previous")).toBeInTheDocument()
  await expect(canvas.getByLabelText("Page 4 of 10")).toBeInTheDocument()
  await expect(canvas.getByLabelText("Page 6 of 10")).toBeInTheDocument()
  await expect(canvas.getByText("Next")).toBeInTheDocument()
}

export const PageTenOfTen: ComponentStory<typeof Pagination> = () => (
  <Pagination pageNum={10} casesPerPage={10} totalCases={100} />
)

PageTenOfTen.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("Previous")).toBeInTheDocument()
  await expect(canvas.getByLabelText("Page 9 of 10")).toBeInTheDocument()
  await expect(canvas.queryByText("Next")).not.toBeInTheDocument()
}

export const ShouldBeAccessible: ComponentStory<typeof Pagination> = () => (
  <div data-testid="pagination">
    <Pagination pageNum={5} casesPerPage={10} totalCases={100} />
  </div>
)

ShouldBeAccessible.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)

  const pagination = canvas.getByTestId("pagination")
  expect(await axe(pagination)).toHaveNoViolations()
}

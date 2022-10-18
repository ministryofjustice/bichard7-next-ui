import { ComponentMeta, ComponentStory } from "@storybook/react"
import Pagination from "./Pagination"
import { within } from "@storybook/testing-library"
import expect from "../../../test/utils/storybook/expect"
import { axe } from "jest-axe"

export default {
  title: "Components/Pagination",
  component: Pagination
} as ComponentMeta<typeof Pagination>

export const PageOneOfTen: ComponentStory<typeof Pagination> = () => <Pagination totalPages={10} pageNum={1} />

PageOneOfTen.story = {
  parameters: {
    nextRouter: {
      basePath: "/bichard"
    }
  }
}

PageOneOfTen.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.queryByText("Previous page")).not.toBeInTheDocument()
  await expect(canvas.getByText("Next page")).toBeInTheDocument()
  await expect(canvas.getByText("2 of 10")).toBeInTheDocument()
}

export const PageFiveOfTen: ComponentStory<typeof Pagination> = () => <Pagination totalPages={10} pageNum={5} />

PageFiveOfTen.story = {
  parameters: {
    nextRouter: {
      basePath: "/bichard"
    }
  }
}

PageFiveOfTen.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("Previous page")).toBeInTheDocument()
  await expect(canvas.getByText("4 of 10")).toBeInTheDocument()
  await expect(canvas.getByText("Next page")).toBeInTheDocument()
  await expect(canvas.getByText("6 of 10")).toBeInTheDocument()
}

export const PageTenOfTen: ComponentStory<typeof Pagination> = () => <Pagination totalPages={10} pageNum={10} />

PageTenOfTen.story = {
  parameters: {
    nextRouter: {
      basePath: "/bichard"
    }
  }
}

PageTenOfTen.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("Previous page")).toBeInTheDocument()
  await expect(canvas.getByText("9 of 10")).toBeInTheDocument()
  await expect(canvas.queryByText("Next page")).not.toBeInTheDocument()
}

export const ShouldBeAccessible: ComponentStory<typeof Pagination> = () => (
  <div data-testid="pagination">
    <Pagination totalPages={10} pageNum={5} />
  </div>
)

ShouldBeAccessible.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)

  const pagination = canvas.getByTestId("pagination")
  expect(await axe(pagination)).toHaveNoViolations()
}

import { expect } from "@storybook/jest"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import ResultsPerPage from "./ResultsPerPage"

export default {
  title: "Components/Pagination/ResultsPerPage",
  component: ResultsPerPage
} as ComponentMeta<typeof ResultsPerPage>

export const TenPerPage: ComponentStory<typeof ResultsPerPage> = () => (
  <div data-testid="results-per-page">
    <ResultsPerPage options={[5, 10, 25, 100]} selected={10} />
  </div>
)
TenPerPage.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByTestId("results-per-page")).toHaveTextContent("View")
  await expect(canvas.getByTestId("results-per-page")).toHaveTextContent("cases per page")
  await expect(canvas.getByTestId("results-per-page").querySelector("select")).toHaveValue("10")
}

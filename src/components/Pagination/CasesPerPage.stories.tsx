import { expect } from "@storybook/jest"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import CasesPerPage from "./CasesPerPage"

export default {
  title: "Components/Pagination/CasesPerPage",
  component: CasesPerPage
} as ComponentMeta<typeof CasesPerPage>

export const TenPerPage: ComponentStory<typeof CasesPerPage> = () => (
  <div data-testid="cases-per-page">
    <CasesPerPage options={[5, 10, 25, 100]} selected={25} pageNum={1} casesPerPage={10} />
  </div>
)
TenPerPage.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByTestId("cases-per-page")).toHaveTextContent("View")
  await expect(canvas.getByTestId("cases-per-page")).toHaveTextContent("cases per page")
  await expect(canvas.getByTestId("cases-per-page").querySelector("select")).toHaveValue("25")
}

import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import expect from "../../../test/utils/storybook/expect"
import NavBar from "./NavBar"

export default {
  title: "Components/NavBar",
  component: NavBar
} as ComponentMeta<typeof NavBar>

export const OnCaseList: ComponentStory<typeof NavBar> = () => <NavBar groups={["GeneralHandler"]} />

OnCaseList.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("Help")).toBeInTheDocument()
  await expect(canvas.getByText("Help")).not.toHaveAttribute("aria-current", "page")
  await expect(canvas.getByText("Case list")).toBeInTheDocument()
  await expect(canvas.getByText("Case list")).toHaveAttribute("aria-current", "page")
  await expect(canvas.getByText("Reports")).toBeInTheDocument()
  await expect(canvas.getByText("Reports")).not.toHaveAttribute("aria-current", "page")
  await expect(canvas.queryByText("User management")).not.toBeInTheDocument()
}

export const OnHelp: ComponentStory<typeof NavBar> = () => <NavBar groups={["GeneralHandler"]} />

OnHelp.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("Help")).toBeInTheDocument()
  await expect(canvas.getByText("Help")).toHaveAttribute("aria-current", "page")
  await expect(canvas.getByText("Case list")).toBeInTheDocument()
  await expect(canvas.getByText("Case list")).not.toHaveAttribute("aria-current", "page")
  await expect(canvas.getByText("Reports")).toBeInTheDocument()
  await expect(canvas.getByText("Reports")).not.toHaveAttribute("aria-current", "page")
}

export const FocusNavBar: ComponentStory<typeof NavBar> = () => <NavBar groups={["GeneralHandler"]} />

FocusNavBar.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const highlightedNavitem = canvas.getByText("Help")
  await (await highlightedNavitem).focus()
}

export const OnUserManagement: ComponentStory<typeof NavBar> = () => <NavBar groups={["UserManager"]} />

OnUserManagement.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("Help")).toBeInTheDocument()
  await expect(canvas.getByText("Help")).not.toHaveAttribute("aria-current", "page")
  await expect(canvas.getByText("Case list")).toBeInTheDocument()
  await expect(canvas.getByText("Case list")).not.toHaveAttribute("aria-current", "page")
  await expect(canvas.getByText("Reports")).toBeInTheDocument()
  await expect(canvas.getByText("Reports")).not.toHaveAttribute("aria-current", "page")
  await expect(canvas.getByText("User management")).toBeInTheDocument()
  await expect(canvas.getByText("User management")).toHaveAttribute("aria-current", "page")
}

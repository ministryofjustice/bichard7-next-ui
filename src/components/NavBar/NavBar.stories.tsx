import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import expect from "../../../test/utils/storybook/expect"
import NavBar from "./NavBar"

export default {
  title: "Components/NavBar",
  component: NavBar
} as ComponentMeta<typeof NavBar>

export const OnCaseList: ComponentStory<typeof NavBar> = () => <NavBar groups={["UserManager"]} />
OnCaseList.story = {
  parameters: {
    nextRouter: {
      basePath: "/bichard"
    }
  }
}

OnCaseList.parameters = {
  design: [
    {
      name: "Design",
      type: "figma",
      url: "https://www.figma.com/file/gy3HppiITvQdHAOD2rpO42/05_-B7_22-Completed-initial-components-(for-devs)?node-id=43%3A10"
    }
  ]
}

OnCaseList.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("Help")).toBeInTheDocument()
  await expect(canvas.getByText("Help")).not.toHaveAttribute("aria-current", "page")
  await expect(canvas.getByText("Case list")).toBeInTheDocument()
  await expect(canvas.getByText("Case list")).toHaveAttribute("aria-current", "page")
  await expect(canvas.getByText("Reports")).toBeInTheDocument()
  await expect(canvas.getByText("Reports")).not.toHaveAttribute("aria-current", "page")
  await expect(canvas.getByText("User management")).toBeInTheDocument()
  await expect(canvas.getByText("User management")).not.toHaveAttribute("aria-current", "page")
}

export const OnHelp: ComponentStory<typeof NavBar> = () => <NavBar groups={["GeneralHandler"]} />
OnHelp.story = {
  parameters: {
    nextRouter: {
      basePath: "/help"
    }
  }
}

OnHelp.parameters = {
  design: [
    {
      name: "Design",
      type: "figma",
      url: "https://www.figma.com/file/gy3HppiITvQdHAOD2rpO42/05_-B7_22-Completed-initial-components-(for-devs)?node-id=43%3A10"
    }
  ]
}

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
FocusNavBar.story = {
  parameters: {
    nextRouter: {
      basePath: "/bichard"
    }
  }
}

FocusNavBar.parameters = {
  design: [
    {
      name: "Design",
      type: "figma",
      url: "https://www.figma.com/file/gy3HppiITvQdHAOD2rpO42/05_-B7_22-Completed-initial-components-(for-devs)?node-id=43%3A10"
    }
  ]
}

FocusNavBar.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const highlightedNavitem = canvas.getByText("Help")
  await (await highlightedNavitem).focus()
}

export const OnReports: ComponentStory<typeof NavBar> = () => <NavBar groups={["GeneralHandler"]} />
OnReports.story = {
  parameters: {
    nextRouter: {
      basePath: "/bichard-ui/ReturnToReportIndex"
    }
  }
}

OnReports.parameters = {
  design: [
    {
      name: "Design",
      type: "figma",
      url: "https://www.figma.com/file/gy3HppiITvQdHAOD2rpO42/05_-B7_22-Completed-initial-components-(for-devs)?node-id=43%3A10"
    }
  ]
}

OnReports.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("Help")).toBeInTheDocument()
  await expect(canvas.getByText("Help")).not.toHaveAttribute("aria-current", "page")
  await expect(canvas.getByText("Case list")).toBeInTheDocument()
  await expect(canvas.getByText("Case list")).not.toHaveAttribute("aria-current", "page")
  await expect(canvas.getByText("Reports")).toBeInTheDocument()
  await expect(canvas.getByText("Reports")).toHaveAttribute("aria-current", "page")
}

export const OnUserManagement: ComponentStory<typeof NavBar> = () => <NavBar groups={["UserManager"]} />
OnUserManagement.story = {
  parameters: {
    nextRouter: {
      basePath: "/users/users"
    }
  }
}

OnUserManagement.parameters = {
  design: [
    {
      name: "Design",
      type: "figma",
      url: "https://www.figma.com/file/gy3HppiITvQdHAOD2rpO42/05_-B7_22-Completed-initial-components-(for-devs)?node-id=43%3A10"
    }
  ]
}

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

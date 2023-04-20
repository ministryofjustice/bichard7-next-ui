import { Meta, StoryObj } from "@storybook/react"
import { within } from "@storybook/testing-library"
import NavBar from "./NavBar"
import { expect } from "@storybook/jest"

export default {
  title: "Components/NavBar",
  component: NavBar
} as Meta<typeof NavBar>

export const OnCaseList: StoryObj<typeof NavBar> = {
  args: {
    groups: ["GeneralHandler"]
  },
  parameters: {
    nextjs: {
      router: {
        basePath: "/bichard"
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Help")).toBeInTheDocument()
    await expect(canvas.getByText("Help")).not.toHaveAttribute("aria-current", "page")
    await expect(canvas.getByText("Case list")).toBeInTheDocument()
    await expect(canvas.getByText("Case list")).toHaveAttribute("aria-current", "page")
    await expect(canvas.getByText("Reports")).toBeInTheDocument()
    await expect(canvas.getByText("Reports")).not.toHaveAttribute("aria-current", "page")
    await expect(canvas.queryByText("User management")).not.toBeInTheDocument()
  }
}

export const OnHelp: StoryObj<typeof NavBar> = {
  args: {
    groups: ["GeneralHandler"]
  },
  parameters: {
    nextjs: {
      router: {
        basePath: "/help"
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Help")).toBeInTheDocument()
    await expect(canvas.getByText("Help")).toHaveAttribute("aria-current", "page")
    await expect(canvas.getByText("Case list")).toBeInTheDocument()
    await expect(canvas.getByText("Case list")).not.toHaveAttribute("aria-current", "page")
    await expect(canvas.getByText("Reports")).toBeInTheDocument()
    await expect(canvas.getByText("Reports")).not.toHaveAttribute("aria-current", "page")
  }
}

export const FocusNavBar: StoryObj<typeof NavBar> = {
  args: {
    groups: ["GeneralHandler"]
  },
  parameters: {
    nextjs: {
      router: {
        basePath: "/bichard"
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const highlightedNavitem = canvas.getByText("Help")
    await (await highlightedNavitem).focus()
  }
}

export const OnUserManagement: StoryObj<typeof NavBar> = {
  args: {
    groups: ["UserManager"]
  },
  parameters: {
    nextjs: {
      router: {
        basePath: "/users/users"
      }
    }
  },
  play: async ({ canvasElement }) => {
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
}

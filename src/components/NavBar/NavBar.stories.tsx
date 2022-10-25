import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import expect from "../../../test/util/storybook/expect"
import NavBar from "./NavBar"

export default {
  title: "Components/NavBar",
  component: NavBar
} as ComponentMeta<typeof NavBar>

export const DisplaysNavBar: ComponentStory<typeof NavBar> = () => <NavBar />
DisplaysNavBar.story = {
  parameters: {
    nextRouter: {
      basePath: "/bichard"
    }
  }
}

DisplaysNavBar.parameters = {
  design: [
    {
      name: "Design",
      type: "figma",
      url: "https://www.figma.com/file/gy3HppiITvQdHAOD2rpO42/05_-B7_22-Completed-initial-components-(for-devs)?node-id=43%3A10"
    }
  ]
}

DisplaysNavBar.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("Help")).toBeInTheDocument()
  await expect(canvas.getByText("Case list")).toBeInTheDocument()
}

export const FocusNavBar: ComponentStory<typeof NavBar> = () => <NavBar />
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

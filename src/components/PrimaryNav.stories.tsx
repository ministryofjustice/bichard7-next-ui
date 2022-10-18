import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import NavBar from "./NavBar"
import expect from "../../test/util/storybook/expect"

export default {
  title: "Components/PrimaryNav",
  component: NavBar
} as ComponentMeta<typeof NavBar>

export const NavBarStory: ComponentStory<typeof NavBar> = () => <NavBar />
NavBarStory.story = {
  parameters: {
    nextRouter: {
      basePath: "/bichard"
    }
  }
}

NavBarStory.parameters = {
  design: [
    {
      name: "Design",
      type: "figma",
      url: "https://www.figma.com/file/gy3HppiITvQdHAOD2rpO42/05_-B7_22-Completed-initial-components-(for-devs)?node-id=43%3A10"
    }
  ]
}

NavBarStory.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("Help")).toBeInTheDocument()
}

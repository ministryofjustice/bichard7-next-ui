import { ComponentMeta, ComponentStory } from "@storybook/react"
import { within } from "@storybook/testing-library"
import expect from "../../test/util/storybook/expect"
import MojHeader from "./MojHeader"

export default {
  title: "Components/MojHeader",
  component: MojHeader
} as ComponentMeta<typeof MojHeader>

export const MojHeaderStory: ComponentStory<typeof MojHeader> = () => (
  <MojHeader serviceName={"Bichard7"} organisationName={"Ministry of Justice"} userName={"User01"} />
)
MojHeaderStory.story = {
  parameters: {
    nextRouter: {
      basePath: "/bichard"
    }
  }
}

MojHeaderStory.parameters = {
  design: [
    {
      name: "Design",
      type: "figma",
      url: "https://www.figma.com/file/gy3HppiITvQdHAOD2rpO42/05_-B7_22-Completed-initial-components-(for-devs)?node-id=43%3A10"
    }
  ]
}

MojHeaderStory.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("Ministry of Justice")).toBeInTheDocument()
  await expect(canvas.getByText("Bichard7")).toBeInTheDocument()
  await expect(canvas.getByText("User01")).toBeInTheDocument()
}

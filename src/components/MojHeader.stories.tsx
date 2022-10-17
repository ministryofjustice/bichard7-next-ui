import { ComponentMeta, ComponentStory } from "@storybook/react"
import MojHeader from "./MojHeader"

export default {
  title: "Components/MojHeader",
  component: MojHeader
} as ComponentMeta<typeof MojHeader>

export const MojHeaderStoryEmpty: ComponentStory<typeof MojHeader> = () => (
  <MojHeader serviceName={""} organisationName={""} userName={""} />
)
MojHeaderStoryEmpty.story = {
  parameters: {
    nextRouter: {
      basePath: "/bichard"
    }
  }
}

MojHeaderStoryEmpty.parameters = {
  design: [
    {
      name: "Design",
      type: "figma",
      url: "https://www.figma.com/file/gy3HppiITvQdHAOD2rpO42/05_-B7_22-Completed-initial-components-(for-devs)?node-id=43%3A10"
    }
  ]
}
export const MojHeaderStory: ComponentStory<typeof MojHeader> = () => (
  <MojHeader serviceName={"Bichard7"} organisationName={"Ministry of Justice"} userName={"User Name"} />
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

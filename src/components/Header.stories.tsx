import { ComponentMeta, ComponentStory } from "@storybook/react"
import Header from "./Header"

export default {
  title: "Components/Header",
  component: Header
} as ComponentMeta<typeof Header>

export const HeaderStory: ComponentStory<typeof Header> = () => <Header serviceName={"test"} />

HeaderStory.story = {
  parameters: {
    nextRouter: {
      basePath: "/bichard"
    }
  }
}

HeaderStory.parameters = {
  design: [
    {
      name: "Design",
      type: "figma",
      url: "https://www.figma.com/file/gy3HppiITvQdHAOD2rpO42/05_-B7_22-Completed-initial-components-(for-devs)?node-id=43%3A10"
    }
  ]
}

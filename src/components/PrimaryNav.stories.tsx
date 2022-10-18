import { ComponentMeta, ComponentStory } from "@storybook/react"
import PrimaryNav from "./PrimaryNav"

export default {
  title: "Components/PrimaryNav",
  component: PrimaryNav
} as ComponentMeta<typeof PrimaryNav>

export const PrimaryNavStory: ComponentStory<typeof PrimaryNav> = () => <PrimaryNav />
PrimaryNavStory.story = {
  parameters: {
    nextRouter: {
      basePath: "/bichard"
    }
  }
}

PrimaryNavStory.parameters = {
  design: [
    {
      name: "Design",
      type: "figma",
      url: "https://www.figma.com/file/gy3HppiITvQdHAOD2rpO42/05_-B7_22-Completed-initial-components-(for-devs)?node-id=43%3A10"
    }
  ]
}

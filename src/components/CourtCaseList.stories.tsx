import { ComponentMeta, ComponentStory } from "@storybook/react"
import CourtCaseList from "./CourtCaseList"

export default {
  title: "CourtCase/List",
  component: CourtCaseList
} as ComponentMeta<typeof CourtCaseList>

export const EmptyList: ComponentStory<typeof CourtCaseList> = () => <CourtCaseList courtCases={[]} />

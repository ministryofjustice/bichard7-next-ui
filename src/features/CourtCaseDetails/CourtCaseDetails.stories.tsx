import { ComponentMeta, ComponentStory } from "@storybook/react"
import CourtCase from "entities/CourtCase"
import Trigger from "entities/Trigger"
import CourtCaseDetails from "./CourtCaseDetails"
import parseAhoXml from "@moj-bichard7-developers/bichard7-next-core/build/src/parse/parseAhoXml/parseAhoXml"
import CourtCaseAho from "../../../test/testFixtures/database/data/error_list_aho.json"

export default {
  title: "Features/CourtCase/Details",
  component: CourtCaseDetails
} as ComponentMeta<typeof CourtCaseDetails>

const courtCase = {
  courtName: "Magistrates' Courts Essex Basildon",
  defendantName: "Allocation Trigger",
  errorId: 79057,
  errorReason: "HO100206",
  messageId: "cf60600b-52a0-4bc7-b117-3acfb851a7f5",
  notes: [],
  orgForPoliceFilter: "36FP  ",
  ptiurn: "42CY0300107",
  triggerReason: "TRPR0006",
  triggers: [{ triggerCode: "TRPR0001" } as unknown as Trigger],
  courtDate: new Date("2008-09-26")
} as unknown as CourtCase

export const Details: ComponentStory<typeof CourtCaseDetails> = () => <CourtCaseDetails courtCase={courtCase} />

export const DetailsWithAho: ComponentStory<typeof CourtCaseDetails> = () => (
  <CourtCaseDetails courtCase={{ ...courtCase, ahoXml: parseAhoXml(CourtCaseAho.annotated_msg) } as CourtCase} />
)

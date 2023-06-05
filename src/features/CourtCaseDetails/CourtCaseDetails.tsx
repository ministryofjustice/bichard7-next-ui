import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import ConditionalRender from "components/ConditionalRender"
import LinkButton from "components/LinkButton"
import { GridCol, GridRow, Heading } from "govuk-react"
import CourtCase from "services/entities/CourtCase"
import UrgentBadge from "features/CourtCaseList/tags/UrgentBadge"
import CourtCaseDetailsSummaryBox from "./CourtCaseDetailsSummaryBox"
import { useState } from "react"
import { CourtCaseDetailsTabs } from "./Tabs/CourtCaseDetailsTabs"
import { CourtCaseDetailsPanel } from "./Tabs/CourtCaseDetailsPanels"
import { Offences } from "./Tabs/Panels/Offences/Offences"
import { HearingDetails } from "./Tabs/Panels/HearingDetails"
import TriggersAndExceptions from "./Sidebar/TriggersAndExceptions"
import { createUseStyles } from "react-jss"
import type NavigationHandler from "types/NavigationHandler"
import type CaseDetailsTab from "types/CaseDetailsTab"
import { Notes } from "./Tabs/Panels/Notes/Notes"

interface Props {
  courtCase: CourtCase
  aho: AnnotatedHearingOutcome
  lockedByAnotherUser: boolean
}

const useStyles = createUseStyles({
  contentColumn: {
    overflowX: "scroll"
  }
})

const sideBarWidth = "33%"
const contentWidth = "67%"

const CourtCaseDetails: React.FC<Props> = ({ courtCase, aho, lockedByAnotherUser }) => {
  const [activeTab, setActiveTab] = useState<CaseDetailsTab>("Defendant")
  const [selectedOffenceIndex, setSelectedOffenceIndex] = useState<number | undefined>(undefined)
  const classes = useStyles()

  const handleNavigation: NavigationHandler = ({ location, args }) => {
    switch (location) {
      case "Case Details > Case information":
        setActiveTab("Case information")
        break
      case "Case Details > Offences":
        if (typeof args?.offenceOrderIndex === "number") {
          setSelectedOffenceIndex(+args.offenceOrderIndex)
        }
        setActiveTab("Offences")
        break
    }
  }

  return (
    <>
      <Heading as="h1" size="LARGE" className="govuk-!-font-weight-regular">
        {"Case details"}
      </Heading>
      <Heading as="h2" size="MEDIUM" className="govuk-!-font-weight-regular">
        {courtCase.defendantName}
        <UrgentBadge
          isUrgent={courtCase.isUrgent}
          className="govuk-!-static-margin-left-5 govuk-!-font-weight-regular"
        />
      </Heading>
      <CourtCaseDetailsSummaryBox
        asn={courtCase.asn}
        courtCode={courtCase.courtCode}
        courtName={courtCase.courtName}
        courtReference={courtCase.courtReference}
        pnci={aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCIdentifier}
        ptiurn={courtCase.ptiurn}
      />
      <CourtCaseDetailsTabs
        activeTab={activeTab}
        onTabClick={(tab) => {
          setSelectedOffenceIndex(undefined)
          setActiveTab(tab)
        }}
        tabs={["Defendant", "Hearing", "Case information", "Offences", "Notes", "PNC errors"]}
        width={contentWidth}
      />

      <GridRow>
        <GridCol setWidth={contentWidth} className={classes.contentColumn}>
          <ConditionalRender isRendered={activeTab === "Defendant"}>
            <CourtCaseDetailsPanel heading={"Defendant details"}>{""}</CourtCaseDetailsPanel>
          </ConditionalRender>

          <ConditionalRender isRendered={activeTab === "Hearing"}>
            <CourtCaseDetailsPanel heading={"Hearing details"}>
              <HearingDetails hearing={aho.AnnotatedHearingOutcome.HearingOutcome.Hearing} />
            </CourtCaseDetailsPanel>
          </ConditionalRender>

          <ConditionalRender isRendered={activeTab === "Case information"}>
            <CourtCaseDetailsPanel heading={"Case information"}>{""}</CourtCaseDetailsPanel>
          </ConditionalRender>

          <ConditionalRender isRendered={activeTab === "Offences"}>
            <Offences
              offences={aho.AnnotatedHearingOutcome.HearingOutcome.Case?.HearingDefendant?.Offence}
              onOffenceSelected={setSelectedOffenceIndex}
              selectedOffenceIndex={selectedOffenceIndex}
            />
          </ConditionalRender>

          <ConditionalRender isRendered={activeTab === "Notes"}>
            <Notes notes={courtCase.notes} lockedByAnotherUser={lockedByAnotherUser} />
          </ConditionalRender>

          <ConditionalRender isRendered={activeTab === "PNC errors"}>
            <CourtCaseDetailsPanel heading={"PNC errors"}>{""}</CourtCaseDetailsPanel>
          </ConditionalRender>

          <ConditionalRender isRendered={!lockedByAnotherUser && activeTab !== "Notes"}>
            <LinkButton href="reallocate">{"Reallocate Case"}</LinkButton>
          </ConditionalRender>
          <ConditionalRender isRendered={!lockedByAnotherUser && activeTab !== "Notes"}>
            <LinkButton href="resolve">{"Mark As Manually Resolved"}</LinkButton>
          </ConditionalRender>
        </GridCol>

        <GridCol setWidth={sideBarWidth}>
          <TriggersAndExceptions courtCase={courtCase} aho={aho} onNavigate={handleNavigation} />
        </GridCol>
      </GridRow>
    </>
  )
}

export default CourtCaseDetails

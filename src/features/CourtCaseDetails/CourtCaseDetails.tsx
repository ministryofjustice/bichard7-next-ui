import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import ConditionalRender from "components/ConditionalRender"
import LinkButton from "components/LinkButton"
import UrgentBadge from "features/CourtCaseList/tags/UrgentBadge"
import { GridCol, GridRow, Heading } from "govuk-react"
import { useEffect, useState } from "react"
import { createUseStyles } from "react-jss"
import CourtCase from "services/entities/CourtCase"
import type CaseDetailsTab from "types/CaseDetailsTab"
import type NavigationHandler from "types/NavigationHandler"
import CourtCaseDetailsSummaryBox from "./CourtCaseDetailsSummaryBox"
import TriggersAndExceptions from "./Sidebar/TriggersAndExceptions"
import { CourtCaseDetailsPanel } from "./Tabs/CourtCaseDetailsPanels"
import { CourtCaseDetailsTabs } from "./Tabs/CourtCaseDetailsTabs"
import { HearingDetails } from "./Tabs/Panels/HearingDetails"
import { Notes } from "./Tabs/Panels/Notes/Notes"
import { DefendantDetails } from "./Tabs/Panels/DefendantDetails"
import { Offences } from "./Tabs/Panels/Offences/Offences"
import updateQueryString from "utils/updateQueryString"

interface Props {
  courtCase: CourtCase
  aho: AnnotatedHearingOutcome
  errorLockedByAnotherUser: boolean
  triggersLockedByCurrentUser: boolean
  triggersLockedByUser: string | null
}

const useStyles = createUseStyles({
  contentColumn: {
    overflowX: "scroll"
  },
  sideBarContainer: {
    minWidth: "320px",
    maxWidth: "430px"
  }
})

const sideBarWidth = "33%"
const contentWidth = "67%"

const CourtCaseDetails: React.FC<Props> = ({
  courtCase,
  aho,
  errorLockedByAnotherUser,
  triggersLockedByCurrentUser,
  triggersLockedByUser
}) => {
  const [activeTab, setActiveTab] = useState<CaseDetailsTab>("Defendant")
  const [selectedOffenceIndex, setSelectedOffenceIndex] = useState<number | undefined>(undefined)
  const classes = useStyles()

  useEffect(() => {
    const queryStringParams = new URLSearchParams(window.location.search)

    const tabParam = queryStringParams.get("tab")
    if (tabParam) {
      setActiveTab(tabParam as CaseDetailsTab)
    }

    const offenceParam = queryStringParams.get("offence")
    if (offenceParam) {
      setSelectedOffenceIndex(+offenceParam)
    }
  }, [])

  const handleNavigation: NavigationHandler = ({ location, args }) => {
    switch (location) {
      case "Case Details > Case information":
        setActiveTab("Case information")
        break
      case "Case Details > Offences":
        if (typeof args?.offenceOrderIndex === "number") {
          setSelectedOffenceIndex(+args.offenceOrderIndex)
          updateQueryString({ offence: args.offenceOrderIndex })
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
          updateQueryString({ tab, offence: null })
        }}
        tabs={["Defendant", "Hearing", "Case information", "Offences", "Notes", "PNC errors"]}
        width={contentWidth}
      />

      <GridRow>
        <GridCol setWidth={contentWidth} className={classes.contentColumn}>
          <ConditionalRender isRendered={activeTab === "Defendant"}>
            <DefendantDetails defendant={aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant} />
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
              onOffenceSelected={(offenceIndex) => {
                setSelectedOffenceIndex(offenceIndex)
                updateQueryString({ offence: offenceIndex })
              }}
              selectedOffenceIndex={selectedOffenceIndex}
            />
          </ConditionalRender>

          <ConditionalRender isRendered={activeTab === "Notes"}>
            <Notes notes={courtCase.notes} lockedByAnotherUser={errorLockedByAnotherUser} />
          </ConditionalRender>

          <ConditionalRender isRendered={activeTab === "PNC errors"}>
            <CourtCaseDetailsPanel heading={"PNC errors"}>{""}</CourtCaseDetailsPanel>
          </ConditionalRender>

          <ConditionalRender isRendered={!errorLockedByAnotherUser && activeTab !== "Notes"}>
            <LinkButton href="reallocate" className="b7-reallocate-button">
              {"Reallocate Case"}
            </LinkButton>
          </ConditionalRender>
          <ConditionalRender isRendered={!errorLockedByAnotherUser && activeTab !== "Notes"}>
            <LinkButton href="resolve" className="b7-resolve-button">
              {"Mark As Manually Resolved"}
            </LinkButton>
          </ConditionalRender>
        </GridCol>
        <GridCol setWidth={sideBarWidth} className={classes.sideBarContainer}>
          <TriggersAndExceptions
            courtCase={courtCase}
            aho={aho}
            triggersLockedByCurrentUser={triggersLockedByCurrentUser}
            triggersLockedByUser={triggersLockedByUser}
            onNavigate={handleNavigation}
          />
        </GridCol>
      </GridRow>
    </>
  )
}

export default CourtCaseDetails

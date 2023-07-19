import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/dist/types/AnnotatedHearingOutcome"
import ConditionalRender from "components/ConditionalRender"
import { GridCol, GridRow } from "govuk-react"
import { useEffect, useState } from "react"
import { createUseStyles } from "react-jss"
import CourtCase from "services/entities/CourtCase"
import type CaseDetailsTab from "types/CaseDetailsTab"
import type NavigationHandler from "types/NavigationHandler"
import CourtCaseDetailsSummaryBox from "./CourtCaseDetailsSummaryBox"
import TriggersAndExceptions, { Tab } from "./Sidebar/TriggersAndExceptions"
import { CourtCaseDetailsPanel } from "./Tabs/CourtCaseDetailsPanels"
import { CourtCaseDetailsTabs } from "./Tabs/CourtCaseDetailsTabs"
import { HearingDetails } from "./Tabs/Panels/HearingDetails"
import { Notes } from "./Tabs/Panels/Notes/Notes"
import { DefendantDetails } from "./Tabs/Panels/DefendantDetails"
import { Offences } from "./Tabs/Panels/Offences/Offences"
import updateQueryString from "utils/updateQueryString"
import { CaseInformation } from "./Tabs/Panels/CaseInformation"
import Header from "./Header"
import User from "services/entities/User"

interface Props {
  courtCase: CourtCase
  aho: AnnotatedHearingOutcome
  errorLockedByAnotherUser: boolean
  user: User
  canReallocate: boolean
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

const CourtCaseDetails: React.FC<Props> = ({ courtCase, aho, user, errorLockedByAnotherUser, canReallocate }) => {
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
      case "Case Details > Case":
        setActiveTab("Case")
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

  let tabToRender: Tab | undefined
  if (user.hasAccessToTriggers && !user.hasAccessToExceptions) {
    tabToRender = Tab.Triggers
  } else if (user.hasAccessToExceptions && !user.hasAccessToTriggers) {
    tabToRender = Tab.Exceptions
  }

  return (
    <>
      <Header courtCase={courtCase} user={user} canReallocate={canReallocate} />
      <CourtCaseDetailsSummaryBox
        asn={courtCase.asn}
        courtCode={courtCase.courtCode}
        courtName={courtCase.courtName}
        courtReference={courtCase.courtReference}
        pnci={aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCIdentifier}
        ptiurn={courtCase.ptiurn}
        dob={aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.BirthDate?.toString()}
        hearingDate={aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing.toString()}
      />
      <CourtCaseDetailsTabs
        activeTab={activeTab}
        onTabClick={(tab) => {
          setSelectedOffenceIndex(undefined)
          setActiveTab(tab)
          updateQueryString({ tab, offence: null })
        }}
        tabs={["Defendant", "Hearing", "Case", "Offences", "Notes"]}
        width={contentWidth}
      />

      <GridRow>
        <GridCol setWidth={contentWidth} className={classes.contentColumn}>
          <ConditionalRender isRendered={activeTab === "Defendant"}>
            <CourtCaseDetailsPanel heading={"Defendant details"}>
              <DefendantDetails defendant={aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant} />
            </CourtCaseDetailsPanel>
          </ConditionalRender>

          <ConditionalRender isRendered={activeTab === "Hearing"}>
            <CourtCaseDetailsPanel heading={"Hearing details"}>
              <HearingDetails hearing={aho.AnnotatedHearingOutcome.HearingOutcome.Hearing} />
            </CourtCaseDetailsPanel>
          </ConditionalRender>

          <ConditionalRender isRendered={activeTab === "Case"}>
            <CourtCaseDetailsPanel heading={"Case"}>
              <CaseInformation caseInformation={aho.AnnotatedHearingOutcome.HearingOutcome.Case} />
            </CourtCaseDetailsPanel>
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
        </GridCol>

        <GridCol setWidth={sideBarWidth} className={classes.sideBarContainer}>
          <TriggersAndExceptions
            courtCase={courtCase}
            aho={aho}
            renderedTab={tabToRender}
            user={user}
            onNavigate={handleNavigation}
          />
        </GridCol>
      </GridRow>
    </>
  )
}

export default CourtCaseDetails

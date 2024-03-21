import { useCourtCase } from "context/CourtCaseContext"
import { GridCol, GridRow } from "govuk-react"
import { useCallback, useState } from "react"
import { useBeforeunload } from "react-beforeunload"
import { createUseStyles } from "react-jss"
import type CaseDetailsTab from "types/CaseDetailsTab"
import type NavigationHandler from "types/NavigationHandler"
import TriggersAndExceptions from "./Sidebar/TriggersAndExceptions"
import { CourtCaseDetailsPanel } from "./Tabs/CourtCaseDetailsPanels"
import { CourtCaseDetailsTabs } from "./Tabs/CourtCaseDetailsTabs"
import { CaseInformation } from "./Tabs/Panels/CaseInformation"
import { DefendantDetails } from "./Tabs/Panels/DefendantDetails"
import { HearingDetails } from "./Tabs/Panels/HearingDetails"
import { Notes } from "./Tabs/Panels/Notes/Notes"
import { Offences } from "./Tabs/Panels/Offences/Offences"

interface Props {
  isLockedByCurrentUser: boolean
  canResolveAndSubmit: boolean
}

const useStyles = createUseStyles({
  contentColumn: {
    overflowX: "scroll"
  },
  sideBarContainer: {
    minWidth: "320px",
    maxWidth: "430px"
  },
  visible: {
    visibility: "visible",
    display: "block"
  },
  notVisible: {
    visibility: "hidden",
    display: "none"
  }
})

const sideBarWidth = "33%"
const contentWidth = "67%"

const CourtCaseDetails: React.FC<Props> = ({ isLockedByCurrentUser, canResolveAndSubmit }) => {
  const { courtCase } = useCourtCase()
  const [activeTab, setActiveTab] = useState<CaseDetailsTab>("Defendant")
  const [selectedOffenceIndex, setSelectedOffenceIndex] = useState<number | undefined>(undefined)
  const classes = useStyles()

  const [useBeforeUnload, setUseBeforeUnload] = useState<boolean>(false)

  const stopLeavingFn = useCallback((newValue: boolean) => {
    setUseBeforeUnload(newValue)
  }, [])

  useBeforeunload(useBeforeUnload ? (event: BeforeUnloadEvent) => event.preventDefault() : undefined)

  const handleNavigation: NavigationHandler = ({ location, args }) => {
    switch (location) {
      case "Case Details > Case":
        setActiveTab("Case")
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
      <CourtCaseDetailsTabs
        activeTab={activeTab}
        onTabClick={(tab) => {
          setActiveTab(tab)
        }}
        tabs={["Defendant", "Hearing", "Case", "Offences", "Notes"]}
        width={contentWidth}
      />

      <GridRow>
        <GridCol setWidth={contentWidth} className={classes.contentColumn}>
          <CourtCaseDetailsPanel
            className={activeTab === "Defendant" ? classes.visible : classes.notVisible}
            heading={"Defendant details"}
          >
            <DefendantDetails stopLeavingFn={stopLeavingFn} />
          </CourtCaseDetailsPanel>

          <CourtCaseDetailsPanel
            className={activeTab === "Hearing" ? classes.visible : classes.notVisible}
            heading={"Hearing details"}
          >
            <HearingDetails hearing={courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Hearing} />
          </CourtCaseDetailsPanel>

          <CourtCaseDetailsPanel
            className={activeTab === "Case" ? classes.visible : classes.notVisible}
            heading={"Case"}
          >
            <CaseInformation caseInformation={courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case} />
          </CourtCaseDetailsPanel>

          <Offences
            className={activeTab === "Offences" ? classes.visible : classes.notVisible}
            exceptions={courtCase.aho.Exceptions}
            offences={courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case?.HearingDefendant?.Offence}
            onOffenceSelected={(offenceIndex) => {
              setSelectedOffenceIndex(offenceIndex)
            }}
            selectedOffenceIndex={selectedOffenceIndex}
          />

          <Notes
            className={activeTab === "Notes" ? classes.visible : classes.notVisible}
            isLockedByCurrentUser={isLockedByCurrentUser}
          />
        </GridCol>

        <GridCol setWidth={sideBarWidth} className={classes.sideBarContainer}>
          <TriggersAndExceptions
            onNavigate={handleNavigation}
            canResolveAndSubmit={canResolveAndSubmit}
            stopLeavingFn={stopLeavingFn}
          />
        </GridCol>
      </GridRow>
    </>
  )
}

export default CourtCaseDetails

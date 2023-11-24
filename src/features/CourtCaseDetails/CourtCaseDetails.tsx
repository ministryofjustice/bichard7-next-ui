import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { GridCol, GridRow } from "govuk-react"
import { useState } from "react"
import { createUseStyles } from "react-jss"
import type CaseDetailsTab from "types/CaseDetailsTab"
import type NavigationHandler from "types/NavigationHandler"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import { DisplayFullUser } from "types/display/Users"
import TriggersAndExceptions from "./Sidebar/TriggersAndExceptions"
import { CourtCaseDetailsPanel } from "./Tabs/CourtCaseDetailsPanels"
import { CourtCaseDetailsTabs } from "./Tabs/CourtCaseDetailsTabs"
import { CaseInformation } from "./Tabs/Panels/CaseInformation"
import { DefendantDetails } from "./Tabs/Panels/DefendantDetails"
import { HearingDetails } from "./Tabs/Panels/HearingDetails"
import { Notes } from "./Tabs/Panels/Notes/Notes"
import { Offences } from "./Tabs/Panels/Offences/Offences"
import { AmendmentKeys, AmendmentRecords, IndividualAmendmentValues } from "../../types/Amendments"
import setAmendedFields from "../../utils/amendments/setAmendedField"

interface Props {
  courtCase: DisplayFullCourtCase
  aho: AnnotatedHearingOutcome
  isLockedByCurrentUser: boolean
  user: DisplayFullUser
  canResolveAndSubmit: boolean
  csrfToken: string
  previousPath: string
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

const CourtCaseDetails: React.FC<Props> = ({
  courtCase,
  aho,
  user,
  isLockedByCurrentUser,
  canResolveAndSubmit,
  csrfToken,
  previousPath
}) => {
  const [activeTab, setActiveTab] = useState<CaseDetailsTab>("Defendant")
  const [selectedOffenceIndex, setSelectedOffenceIndex] = useState<number | undefined>(undefined)
  const classes = useStyles()

  const [amendments, setAmendements] = useState<AmendmentRecords>({})

  const amendFn = (keyToAmend: AmendmentKeys) => (newValue: IndividualAmendmentValues) => {
    setAmendements({ ...setAmendedFields(keyToAmend, newValue, amendments) })
  }

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
            <DefendantDetails defendant={aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant} />
          </CourtCaseDetailsPanel>

          <CourtCaseDetailsPanel
            className={activeTab === "Hearing" ? classes.visible : classes.notVisible}
            heading={"Hearing details"}
          >
            <HearingDetails hearing={aho.AnnotatedHearingOutcome.HearingOutcome.Hearing} />
          </CourtCaseDetailsPanel>

          <CourtCaseDetailsPanel
            className={activeTab === "Case" ? classes.visible : classes.notVisible}
            heading={"Case"}
          >
            <CaseInformation caseInformation={aho.AnnotatedHearingOutcome.HearingOutcome.Case} />
          </CourtCaseDetailsPanel>

          <Offences
            className={activeTab === "Offences" ? classes.visible : classes.notVisible}
            exceptions={aho.Exceptions}
            offences={aho.AnnotatedHearingOutcome.HearingOutcome.Case?.HearingDefendant?.Offence}
            onOffenceSelected={(offenceIndex) => {
              setSelectedOffenceIndex(offenceIndex)
            }}
            selectedOffenceIndex={selectedOffenceIndex}
            courtCase={courtCase}
            amendments={amendments}
            amendFn={amendFn}
          />

          <Notes
            className={activeTab === "Notes" ? classes.visible : classes.notVisible}
            notes={courtCase.notes}
            isLockedByCurrentUser={isLockedByCurrentUser}
            csrfToken={csrfToken}
          />
        </GridCol>

        <GridCol setWidth={sideBarWidth} className={classes.sideBarContainer}>
          <TriggersAndExceptions
            courtCase={courtCase}
            aho={aho}
            user={user}
            onNavigate={handleNavigation}
            canResolveAndSubmit={canResolveAndSubmit}
            csrfToken={csrfToken}
            previousPath={previousPath}
            amendments={amendments}
          />
        </GridCol>
      </GridRow>
    </>
  )
}

export default CourtCaseDetails

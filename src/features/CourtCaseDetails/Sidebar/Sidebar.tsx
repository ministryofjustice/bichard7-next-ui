import ConditionalRender from "components/ConditionalRender"
import { useCourtCase } from "context/CourtCaseContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { Tabs } from "govuk-react"
import { useState } from "react"
import type NavigationHandler from "types/NavigationHandler"
import Permission from "types/Permission"
import ExceptionsList from "./ExceptionsList"
import { SidebarContainer, TabContent, TabList, TablePanel } from "./Sidebar.styles"
import TriggersList from "./TriggersList"

enum SidebarTab {
  Exceptions,
  Triggers,
  PncDetails
}

interface Props {
  onNavigate: NavigationHandler
  canResolveAndSubmit: boolean
  stopLeavingFn: (newValue: boolean) => void
}

const Sidebar = ({ onNavigate, canResolveAndSubmit, stopLeavingFn }: Props) => {
  const currentUser = useCurrentUser()
  const { courtCase } = useCourtCase()

  const permissions: { [tab: number]: boolean } = {
    [SidebarTab.Exceptions]: currentUser.hasAccessTo[Permission.Exceptions],
    [SidebarTab.Triggers]: currentUser.hasAccessTo[Permission.Triggers],
    [SidebarTab.PncDetails]: !!currentUser.featureFlags.pncDetailsTab // to be removed for go-live
  }

  const accessibleTabs = Object.entries(permissions)
    .map((tab) => {
      const [tabId, accessible] = tab
      if (accessible) {
        return Number(tabId)
      }
    })
    .filter((tab) => tab)

  let defaultTab = SidebarTab.PncDetails
  if (accessibleTabs.includes(SidebarTab.Triggers) && courtCase.triggerCount > 0) {
    defaultTab = SidebarTab.Triggers
  } else if (accessibleTabs.includes(SidebarTab.Exceptions)) {
    defaultTab = SidebarTab.Exceptions
  }

  // const defaultTab =
  //   accessibleTabs.length > 0
  //     ? accessibleTabs.length == 2 && courtCase.triggerCount === 0
  //       ? accessibleTabs[1]
  //       : accessibleTabs[0]
  //     : undefined

  const [selectedTab, setSelectedTab] = useState(defaultTab)

  return (
    <SidebarContainer className={`side-bar case-details-sidebar`}>
      <ConditionalRender isRendered={currentUser.hasAccessTo[Permission.CaseDetailsSidebar]}>
        <Tabs>
          <TabList>
            <ConditionalRender isRendered={accessibleTabs.includes(SidebarTab.Triggers)}>
              <Tabs.Tab
                id="triggers-tab"
                className={"tab"}
                onClick={() => setSelectedTab(SidebarTab.Triggers)}
                selected={selectedTab === SidebarTab.Triggers}
              >
                <TabContent>{`Triggers`}</TabContent>
              </Tabs.Tab>
            </ConditionalRender>

            <ConditionalRender isRendered={accessibleTabs.includes(SidebarTab.Exceptions)}>
              <Tabs.Tab
                id="exceptions-tab"
                className={"tab"}
                onClick={() => setSelectedTab(SidebarTab.Exceptions)}
                selected={selectedTab === SidebarTab.Exceptions}
              >
                <TabContent>{`Exceptions`}</TabContent>
              </Tabs.Tab>
            </ConditionalRender>

            <ConditionalRender isRendered={accessibleTabs.includes(SidebarTab.PncDetails)}>
              <Tabs.Tab
                id="pnc-details-tab"
                className={"tab"}
                onClick={() => setSelectedTab(SidebarTab.PncDetails)}
                selected={selectedTab === SidebarTab.PncDetails}
              >
                <TabContent>{`PNC Details`}</TabContent>
              </Tabs.Tab>
            </ConditionalRender>
          </TabList>

          <ConditionalRender isRendered={accessibleTabs.includes(SidebarTab.Triggers)}>
            <TablePanel
              id="triggers"
              selected={selectedTab === SidebarTab.Triggers}
              className={`moj-tab-panel-triggers tab-panel-triggers`}
            >
              <TriggersList onNavigate={onNavigate} />
            </TablePanel>
          </ConditionalRender>

          <ConditionalRender isRendered={accessibleTabs.includes(SidebarTab.Exceptions)}>
            <Tabs.Panel
              id="exceptions"
              selected={selectedTab === SidebarTab.Exceptions}
              className="moj-tab-panel-exceptions"
            >
              <ExceptionsList
                onNavigate={onNavigate}
                canResolveAndSubmit={canResolveAndSubmit}
                stopLeavingFn={stopLeavingFn}
              />
            </Tabs.Panel>
          </ConditionalRender>
        </Tabs>
      </ConditionalRender>
    </SidebarContainer>
  )
}

export default Sidebar

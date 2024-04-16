import ConditionalRender from "components/ConditionalRender"
import { useCourtCase } from "context/CourtCaseContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { Tabs } from "govuk-react"
import { useState } from "react"
import type NavigationHandler from "types/NavigationHandler"
import Permission from "types/Permission"
import Exceptions from "./Exceptions"
import { SideBar, TabContent, TabList, TablePanel } from "./TriggersAndExceptions.styles"
import TriggersList from "./TriggersList"

interface Props {
  onNavigate: NavigationHandler
  canResolveAndSubmit: boolean
  stopLeavingFn: (newValue: boolean) => void
}

const TriggersAndExceptions = ({ onNavigate, canResolveAndSubmit, stopLeavingFn }: Props) => {
  const currentUser = useCurrentUser()
  const { courtCase } = useCourtCase()

  const availableTabs = [Permission.Triggers, Permission.Exceptions].filter((tab) => currentUser.hasAccessTo[tab])
  const defaultTab =
    availableTabs.length > 0
      ? availableTabs.length == 2 && courtCase.triggerCount === 0
        ? availableTabs[1]
        : availableTabs[0]
      : undefined
  const [selectedTab, setSelectedTab] = useState(defaultTab)

  return (
    <SideBar className={`side-bar triggers-and-exceptions-sidebar`}>
      <ConditionalRender isRendered={currentUser.hasAccessTo[Permission.CaseDetailsSidebar]}>
        <Tabs>
          <TabList>
            <ConditionalRender isRendered={currentUser.hasAccessTo[Permission.Triggers]}>
              <Tabs.Tab
                id="triggers-tab"
                className={"tab"}
                onClick={() => setSelectedTab(Permission.Triggers)}
                selected={selectedTab === Permission.Triggers}
              >
                <TabContent>{`Triggers`}</TabContent>
              </Tabs.Tab>
            </ConditionalRender>

            <ConditionalRender isRendered={currentUser.hasAccessTo[Permission.Exceptions]}>
              <Tabs.Tab
                id="exceptions-tab"
                className={"tab"}
                onClick={() => setSelectedTab(Permission.Exceptions)}
                selected={selectedTab === Permission.Exceptions}
              >
                <TabContent>{`Exceptions`}</TabContent>
              </Tabs.Tab>
            </ConditionalRender>
          </TabList>

          <ConditionalRender isRendered={currentUser.hasAccessTo[Permission.Triggers]}>
            <TablePanel
              id="triggers"
              selected={selectedTab === Permission.Triggers}
              className={`moj-tab-panel-triggers tab-panel-triggers`}
            >
              <TriggersList onNavigate={onNavigate} />
            </TablePanel>
          </ConditionalRender>

          <ConditionalRender isRendered={currentUser.hasAccessTo[Permission.Exceptions]}>
            <Tabs.Panel
              id="exceptions"
              selected={selectedTab === Permission.Exceptions}
              className="moj-tab-panel-exceptions"
            >
              <Exceptions
                onNavigate={onNavigate}
                canResolveAndSubmit={canResolveAndSubmit}
                stopLeavingFn={stopLeavingFn}
              />
            </Tabs.Panel>
          </ConditionalRender>
        </Tabs>
      </ConditionalRender>
    </SideBar>
  )
}

export default TriggersAndExceptions

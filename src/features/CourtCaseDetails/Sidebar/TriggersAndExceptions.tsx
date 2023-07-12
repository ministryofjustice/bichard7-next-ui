import { Tabs } from "govuk-react"
import { useState } from "react"
import styled from "styled-components"
import { createUseStyles } from "react-jss"
import CourtCase from "../../../services/entities/CourtCase"
import TriggersList from "./TriggersList"
import ExceptionsList from "./Exceptions"
import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/dist/types/AnnotatedHearingOutcome"
import type NavigationHandler from "types/NavigationHandler"
import ConditionalRender from "components/ConditionalRender"

export enum Tab {
  Triggers = "triggers",
  Exceptions = "exceptions"
}

const useStyles = createUseStyles({
  sideBar: {
    marginTop: "-41px"
  },
  tabPanelTriggers: {
    paddingTop: "10px"
  },
  tab: {
    cursor: "pointer",
    fontWeight: "bold"
  }
})

interface Props {
  courtCase: CourtCase
  aho: AnnotatedHearingOutcome
  renderedTab?: Tab
  triggersLockedByCurrentUser: boolean
  triggersLockedByUser?: string | null
  onNavigate: NavigationHandler
}

const TabList = styled(Tabs.List)`
  & > li:only-child {
    display: flex;
    border-bottom: 1px solid #bfc1c3;

    a {
      flex-grow: 1;
      margin-right: 0;
      cursor: default;
      pointer-events: none;
    }
  }
`

const TriggersAndExceptions = ({
  courtCase,
  aho,
  renderedTab,
  triggersLockedByCurrentUser,
  triggersLockedByUser,
  onNavigate
}: Props) => {
  const [selectedTab, setSelectedTab] = useState("triggers")
  const classes = useStyles()

  const exceptionsSelected = selectedTab === "exceptions" || renderedTab === Tab.Exceptions

  return (
    <div className={`${classes.sideBar} triggers-and-exceptions-sidebar`}>
      <Tabs>
        <TabList>
          <ConditionalRender isRendered={!renderedTab || renderedTab === Tab.Triggers}>
            <Tabs.Tab
              id="triggers-tab"
              className={classes.tab}
              onClick={() => setSelectedTab("triggers")}
              selected={selectedTab === "triggers"}
            >
              {`Triggers`}
            </Tabs.Tab>
          </ConditionalRender>

          <ConditionalRender isRendered={!renderedTab || renderedTab === Tab.Exceptions}>
            <Tabs.Tab
              id="exceptions-tab"
              className={classes.tab}
              onClick={() => setSelectedTab("exceptions")}
              selected={exceptionsSelected}
            >
              {`Exceptions`}
            </Tabs.Tab>
          </ConditionalRender>
        </TabList>

        <ConditionalRender isRendered={!renderedTab || renderedTab === Tab.Triggers}>
          <Tabs.Panel
            id="triggers"
            selected={selectedTab === "triggers"}
            className={`moj-tab-panel-triggers ${classes.tabPanelTriggers}`}
          >
            <TriggersList
              courtCase={courtCase}
              triggersLockedByCurrentUser={triggersLockedByCurrentUser}
              triggersLockedByUser={triggersLockedByUser}
              onNavigate={onNavigate}
            />
          </Tabs.Panel>
        </ConditionalRender>

        <ConditionalRender isRendered={!renderedTab || renderedTab === Tab.Exceptions}>
          <Tabs.Panel id="exceptions" selected={exceptionsSelected} className="moj-tab-panel-exceptions">
            <ExceptionsList aho={aho} onNavigate={onNavigate} />
          </Tabs.Panel>
        </ConditionalRender>
      </Tabs>
    </div>
  )
}

export default TriggersAndExceptions

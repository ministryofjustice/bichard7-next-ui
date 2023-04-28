import { Tabs } from "govuk-react"
import { useState } from "react"
import { createUseStyles } from "react-jss"
import CourtCase from "../../../services/entities/CourtCase"
import TriggersList from "./TriggersList"
import Exceptions from "./Exceptions"
import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"
import type NavigationHandler from "types/NavigationHandler"

interface Props {
  courtCase: CourtCase
  aho: AnnotatedHearingOutcome
  onNavigate: NavigationHandler
}

const useStyles = createUseStyles({
  pointer: {
    cursor: "pointer"
  },
  sideBar: {
    marginTop: "-41px"
  }
})

const TriggersAndExceptions = ({ courtCase, aho, onNavigate }: Props) => {
  const classes = useStyles()
  const [selectedTab, setSelectedTab] = useState("triggers")

  return (
    <div className={`${classes.sideBar} triggers-and-exceptions-sidebar`}>
      <Tabs>
        <Tabs.List>
          <Tabs.Tab
            className={classes.pointer}
            onClick={() => setSelectedTab("triggers")}
            selected={selectedTab === "triggers"}
          >
            {`Triggers`}
          </Tabs.Tab>
          <Tabs.Tab
            className={classes.pointer}
            onClick={() => setSelectedTab("exceptions")}
            selected={selectedTab === "exceptions"}
          >{`Exceptions`}</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel id="triggers" selected={selectedTab === "triggers"} className="moj-tab-panel-triggers">
          <TriggersList courtCase={courtCase} onNavigate={onNavigate} />
        </Tabs.Panel>
        <Tabs.Panel id="exceptions" selected={selectedTab === "exceptions"} className="moj-tab-panel-exceptions">
          <Exceptions aho={aho} onNavigate={onNavigate} />
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}

export default TriggersAndExceptions

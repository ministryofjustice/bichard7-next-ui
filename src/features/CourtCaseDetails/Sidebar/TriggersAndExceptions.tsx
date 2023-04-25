import { Tabs } from "govuk-react"
import { useState } from "react"
import { createUseStyles } from "react-jss"
import CourtCase from "../../../services/entities/CourtCase"
import Triggers from "./Triggers"
import Exceptions from "./Exceptions"
import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"

interface Props {
  courtCase: CourtCase
  aho: AnnotatedHearingOutcome
}

const useStyles = createUseStyles({
  pointer: {
    cursor: "pointer"
  },
  sideBar: {
    marginTop: "-41px"
  }
})

const TriggersAndExceptions = ({ courtCase, aho }: Props) => {
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
          <Triggers courtCase={courtCase} />
        </Tabs.Panel>
        <Tabs.Panel id="exceptions" selected={selectedTab === "exceptions"} className="moj-tab-panel-exceptions">
          <Exceptions aho={aho} />
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}

export default TriggersAndExceptions

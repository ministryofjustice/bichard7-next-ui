import { Tabs } from "govuk-react"
import { useState } from "react"
import { createUseStyles } from "react-jss"
import CourtCase from "../../../services/entities/CourtCase"
import Triggers from "./Triggers"
import Exceptions from "./Exceptions"

interface Props {
  courtCase: CourtCase
}

const useStyles = createUseStyles({
  pointer: {
    cursor: "pointer"
  },
  sideBarMarginTop: {
    marginTop: "-41px"
  }
})

const TriggersAndExceptions: React.FC<Props> = ({ courtCase }) => {
  const classes = useStyles()
  const [selectedTab, setSelectedTab] = useState("triggers")

  return (
    <div className={classes.sideBarMarginTop}>
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
        <Tabs.Panel id="triggers" selected={selectedTab === "triggers"}>
          <Triggers courtCase={courtCase} />
        </Tabs.Panel>
        <Tabs.Panel id="exceptions" selected={selectedTab === "exceptions"}>
          <Exceptions courtCase={courtCase} />
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}

export default TriggersAndExceptions

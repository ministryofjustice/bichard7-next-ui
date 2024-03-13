import { useCourtCase } from "context/CourtCaseContext"
import { createUseStyles } from "react-jss"
import type CaseDetailsTab from "types/CaseDetailsTab"
import getUpdatedFields from "utils/updatedFields/getUpdatedFields"
import getExceptionsCount from "utils/getExceptionsCount"
import { CourtCaseDetailsSingleTab } from "./CourtCaseDetailsSingleTab"

interface CourtCaseDetailsTabsProps {
  activeTab: CaseDetailsTab
  tabs: CaseDetailsTab[]
  onTabClick: (tab: CaseDetailsTab) => void
  width: string
}

const useStyles = createUseStyles({
  nav: ({ width }: { width: string }) => ({
    width
  }),
  roundIcon: {
    fontSize: "0.8em",
    background: "#d4351c",
    border: "3px solid #d4351c",
    minWidth: "25px",
    minHeight: "25px",
    lineHeight: "20px",
    position: "relative"
  }
})

export const CourtCaseDetailsTabs = ({ tabs, activeTab, onTabClick, width }: CourtCaseDetailsTabsProps) => {
  const classes = useStyles({ width })
  const courtCase = useCourtCase()
  const updatedFields = getUpdatedFields(courtCase.aho, courtCase.updatedHearingOutcome)
  const exceptions = getExceptionsCount(courtCase.aho.Exceptions, updatedFields)

  return (
    <nav className={`moj-sub-navigation ${classes.nav}`} aria-label="Sub navigation">
      <ul className="moj-sub-navigation__list">
        {tabs.map((tab) => (
          <CourtCaseDetailsSingleTab
            tab={tab}
            isActive={tab === activeTab}
            key={tab}
            onClick={onTabClick}
            exceptions={exceptions}
          />
        ))}
      </ul>
    </nav>
  )
}

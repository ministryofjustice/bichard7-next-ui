import { createUseStyles } from "react-jss"
import type CaseDetailsTab from "types/CaseDetailsTab"
import { CourtCaseDetailsSingleTab } from "./CourtCaseDetailsSingleTab"
import { useCourtCase } from "context/CourtCaseContext"
import { getTabDetails } from "utils/getTabDetails"

interface CourtCaseDetailsTabsProps {
  activeTab: CaseDetailsTab
  onTabClick: (tab: CaseDetailsTab) => void
  width: string
}

const useStyles = createUseStyles({
  nav: ({ width }: { width: string }) => ({
    width
  })
})

export const CourtCaseDetailsTabs = ({ activeTab, onTabClick, width }: CourtCaseDetailsTabsProps) => {
  const classes = useStyles({ width })
  const { courtCase, amendments } = useCourtCase()
  const tabDetails = getTabDetails(courtCase.aho.Exceptions, amendments)

  return (
    <nav className={`moj-sub-navigation ${classes.nav}`} aria-label="Sub navigation">
      <ul className="moj-sub-navigation__list">
        {tabDetails.map((tab) => {
          return (
            <CourtCaseDetailsSingleTab
              tab={tab}
              isActive={tab.name === activeTab}
              key={tab.name}
              onClick={onTabClick}
            />
          )
        })}
      </ul>
    </nav>
  )
}

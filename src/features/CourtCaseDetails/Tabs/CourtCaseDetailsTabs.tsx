import { createUseStyles } from "react-jss"
import type CaseDetailsTab from "types/CaseDetailsTab"
interface CourtCaseDetailsSingleTabProps {
  tab: CaseDetailsTab
  isActive: boolean
  onClick: (tab: CaseDetailsTab) => void
}

const CourtCaseDetailsSingleTab = ({ tab, isActive, onClick }: CourtCaseDetailsSingleTabProps) => (
  <li className="moj-sub-navigation__item">
    <a
      className="moj-sub-navigation__link"
      aria-current={isActive ? "page" : undefined}
      href="/"
      onClick={(e) => {
        e.preventDefault()
        onClick(tab)
      }}
    >
      {tab}
    </a>
  </li>
)

interface CourtCaseDetailsTabsProps {
  activeTab: CaseDetailsTab
  tabs: CaseDetailsTab[]
  onTabClick: (tab: CaseDetailsTab) => void
  width: string
}

const useStyles = createUseStyles({
  nav: ({ width }: { width: string }) => ({
    width
  })
})

export const CourtCaseDetailsTabs = ({ tabs, activeTab, onTabClick, width }: CourtCaseDetailsTabsProps) => {
  const classes = useStyles({ width })

  return (
    <nav className={`moj-sub-navigation ${classes.nav}`} aria-label="Sub navigation">
      <ul className="moj-sub-navigation__list">
        {tabs.map((tab) => (
          <CourtCaseDetailsSingleTab tab={tab} isActive={tab === activeTab} key={tab} onClick={onTabClick} />
        ))}
      </ul>
    </nav>
  )
}

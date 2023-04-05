export type Tabs = "Defendant" | "Hearing" | "Case information" | "Offences" | "Notes" | "PNC errors"

interface CourtCaseDetailsSingleTabProps {
  tab: Tabs
  isActive: boolean
  onClick: (tab: Tabs) => void
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
  activeTab: Tabs
  tabs: Tabs[]
  onTabClick: (tab: Tabs) => void
}

export const CourtCaseDetailsTabs = ({ tabs, activeTab, onTabClick }: CourtCaseDetailsTabsProps) => {
  return (
    <nav className="moj-sub-navigation" aria-label="Sub navigation">
      <ul className="moj-sub-navigation__list">
        {tabs.map((tab) => (
          <CourtCaseDetailsSingleTab tab={tab} isActive={tab === activeTab} key={tab} onClick={onTabClick} />
        ))}
      </ul>
    </nav>
  )
}

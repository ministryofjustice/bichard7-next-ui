import CaseDetailsTab from "types/CaseDetailsTab"
import { ExceptionIconDetails } from "utils/getExceptionsCount"

interface CourtCaseDetailsSingleTabProps {
  tab: CaseDetailsTab
  isActive: boolean
  onClick: (tab: CaseDetailsTab) => void
  exceptions: ExceptionIconDetails[]
}

export const CourtCaseDetailsSingleTab = ({ tab, isActive, onClick, exceptions }: CourtCaseDetailsSingleTabProps) => {
  return (
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
        {tab} <span />
        {exceptions.map(
          (exception) =>
            exception.tab === tab &&
            exception.exceptionsCount > 0 && (
              <span key={exception.tab} id="notifications" className="moj-notification-badge">
                {exception.exceptionsCount}
              </span>
            )
        )}
      </a>
    </li>
  )
}

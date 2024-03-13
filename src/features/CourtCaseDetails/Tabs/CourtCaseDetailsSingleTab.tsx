import { createUseStyles } from "react-jss"
import CaseDetailsTab from "types/CaseDetailsTab"
import { ExceptionIconDetails } from "utils/getExceptionsCount"

interface CourtCaseDetailsSingleTabProps {
  tab: CaseDetailsTab
  isActive: boolean
  onClick: (tab: CaseDetailsTab) => void
  exceptions: ExceptionIconDetails[]
}

const useStyles = createUseStyles({
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

export const CourtCaseDetailsSingleTab = ({ tab, isActive, onClick, exceptions }: CourtCaseDetailsSingleTabProps) => {
  const classes = useStyles()

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
              <span key={exception.tab} id="notifications" className={`govuk-warning-text__icon ${classes.roundIcon}`}>
                {exception.exceptionsCount}
              </span>
            )
        )}
      </a>
    </li>
  )
}

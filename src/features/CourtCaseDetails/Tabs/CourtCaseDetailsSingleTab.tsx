import Image from "next/image"
import { createUseStyles } from "react-jss"
import CaseDetailsTab from "types/CaseDetailsTab"
import { TabDetails } from "utils/getTabDetails"
import { CHECKMARK_ICON_URL } from "utils/icons"

interface CourtCaseDetailsSingleTabProps {
  tab: TabDetails
  isActive: boolean
  onClick: (tab: CaseDetailsTab) => void
}

const useStyles = createUseStyles({
  checkmark: {
    display: "inline-block",
    verticalAlign: "bottom",
    marginBottom: "-2px"
  }
})

export const CourtCaseDetailsSingleTab = ({ tab, isActive, onClick }: CourtCaseDetailsSingleTabProps) => {
  const classes = useStyles()

  return (
    <li className="moj-sub-navigation__item">
      <a
        className="moj-sub-navigation__link"
        aria-current={isActive ? "page" : undefined}
        href="/"
        onClick={(e) => {
          e.preventDefault()
          onClick(tab.name)
        }}
      >
        {tab.name} <span />
        {tab.exceptionsResolved ? (
          <Image
            className={`checkmark-icon ${classes.checkmark}`}
            key={tab.name}
            src={CHECKMARK_ICON_URL}
            width={30}
            height={30}
            alt="Checkmark icon"
          />
        ) : (
          tab.exceptionsCount > 0 && (
            <span key={tab.name} id="notifications" className="moj-notification-badge">
              {tab.exceptionsCount}
            </span>
          )
        )}
      </a>
    </li>
  )
}

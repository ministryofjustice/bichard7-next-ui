import CaseDetailsTab from "types/CaseDetailsTab"
import { ExceptionIconDetails } from "utils/getExceptionsNotifications"
import { CHECKMARK_ICON_URL } from "utils/icons"
import Image from "next/image"
import { createUseStyles } from "react-jss"

interface CourtCaseDetailsSingleTabProps {
  tab: CaseDetailsTab
  isActive: boolean
  onClick: (tab: CaseDetailsTab) => void
  exceptionsNotifications: ExceptionIconDetails[]
}

const useStyles = createUseStyles({
  checkmark: {
    display: "inline-block",
    verticalAlign: "bottom"
  }
})

export const CourtCaseDetailsSingleTab = ({
  tab,
  isActive,
  onClick,
  exceptionsNotifications
}: CourtCaseDetailsSingleTabProps) => {
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
        {exceptionsNotifications.map((exception) =>
          exception.tab === tab && exception.isResolved ? (
            <Image
              className={`${classes.checkmark}`}
              key={exception.tab}
              src={CHECKMARK_ICON_URL}
              width={30}
              height={30}
              alt="Checkmark icon"
            />
          ) : (
            exception.tab === tab &&
            exception.exceptionsCount > 0 && (
              <span key={exception.tab} id="notifications" className="moj-notification-badge">
                {exception.exceptionsCount}
              </span>
            )
          )
        )}
      </a>
    </li>
  )
}

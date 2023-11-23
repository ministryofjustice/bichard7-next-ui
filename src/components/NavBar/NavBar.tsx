import BoardingContext, { BoardingContextType } from "components/context/BoardingContext"
import { useRouter } from "next/router"
import { MouseEvent, useContext } from "react"
import { useCustomStyles } from "../../../styles/customStyles"

interface NavItemProps {
  name: string
  link: string
  id?: string
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

interface NavBarProps {
  hasAccessToUserManagement: boolean
  hasAccessToReports: boolean
}

const NavItem: React.FC<NavItemProps> = ({ name, id, link, onClick }: NavItemProps) => {
  const { basePath } = useRouter()
  const ariaCurrent = link === basePath + "/" ? "page" : undefined

  const liProps = {
    className: "moj-primary-navigation__item",
    id
  }
  if (!id) {
    delete liProps.id
  }

  const aProps = { onClick }
  if (!onClick) {
    delete aProps.onClick
  }

  return (
    <li {...liProps}>
      <a {...aProps} aria-current={ariaCurrent} className="moj-primary-navigation__link" href={link}>
        {name}
      </a>
    </li>
  )
}

const handleHelp = (e: MouseEvent<HTMLAnchorElement>, boardingContext: BoardingContextType | null) => {
  e.preventDefault()
  boardingContext?.boarding.start()
}

const NavBar: React.FC<NavBarProps> = ({ hasAccessToUserManagement, hasAccessToReports }) => {
  const classes = useCustomStyles()
  const boardingContext = useContext(BoardingContext)

  return (
    <div className="moj-primary-navigation" role="navigation">
      <div className={`${classes["max-width"]} moj-primary-navigation__container`}>
        <div className="moj-primary-navigation__nav">
          <nav className="moj-primary-navigation" aria-label="Primary navigation">
            <ul className="moj-primary-navigation__list">
              <NavItem name={"Case list"} id={"case-list"} link={"/bichard/"} />
              {hasAccessToReports && <NavItem name={"Reports"} link={"/bichard-ui/ReturnToReportIndex"} />}
              {hasAccessToUserManagement && <NavItem name={"User management"} link={"/users/users/"} />}
              <NavItem name={"Help"} id={"help"} link={"#"} onClick={(e) => handleHelp(e, boardingContext)} />
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default NavBar

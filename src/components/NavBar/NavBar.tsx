import { useRouter } from "next/router"
import { useCustomStyles } from "../../../styles/customStyles"

interface NavItemProps {
  name: string
  link: string
}

interface NavBarProps {
  hasAccessToUserManagement: boolean
  hasAccessToReports: boolean
}

const NavItem: React.FC<NavItemProps> = ({ name, link }: NavItemProps) => {
  const { basePath } = useRouter()
  const ariaCurrent = link === basePath + "/" ? "page" : undefined

  return (
    <li className="moj-primary-navigation__item">
      <a aria-current={ariaCurrent} className="moj-primary-navigation__link" href={link}>
        {name}
      </a>
    </li>
  )
}


const NavBar: React.FC<NavBarProps> = ({ hasAccessToUserManagement, hasAccessToReports }) => {
  const classes = useCustomStyles()
  return (
    <div className="moj-primary-navigation" role="navigation">
      <div className={`${classes["max-width"]} moj-primary-navigation__container`}>
        <div className="moj-primary-navigation__nav">
          <nav className="moj-primary-navigation" aria-label="Primary navigation">
            <ul className="moj-primary-navigation__list">
              <NavItem name={"Case list"} link={"/bichard/"} />
              {hasAccessToReports && <NavItem name={"Reports"} link={"/bichard-ui/ReturnToReportIndex"} />}
              {hasAccessToUserManagement && <NavItem name={"User management"} link={"/users/users/"} />}
              <NavItem name={"Help"} link={"/help/"} />
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default NavBar

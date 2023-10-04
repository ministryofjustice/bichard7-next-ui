import ConditionalRender from "components/ConditionalRender"
import { useRouter } from "next/router"
import hasUserManagementAccess from "services/hasUserManagementAccess"
import { UserGroup } from "types/UserGroup"
import { useCustomStyles } from "../../../styles/customStyles"

interface NavItemProps {
  name: string
  link: string
}

interface NavBarProps {
  groups: UserGroup[]
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

const UserManagementNavItem: React.FC<NavBarProps> = (groups) => {
  return (
    <ConditionalRender isRendered={hasUserManagementAccess(groups)}>
      <NavItem name={"User management"} link={"/users/users/"} />
    </ConditionalRender>
  )
}

const NavBar: React.FC<NavBarProps> = ({ groups }) => {
  const classes = useCustomStyles()
  const isSupervisor = groups.some((group) => group === UserGroup.Supervisor)
  return (
    <div className="moj-primary-navigation" role="navigation">
      <div className={`${classes["max-width"]} moj-primary-navigation__container`}>
        <div className="moj-primary-navigation__nav">
          <nav className="moj-primary-navigation" aria-label="Primary navigation">
            <ul className="moj-primary-navigation__list">
              <NavItem name={"Case list"} link={"/bichard/"} />
              {isSupervisor && <NavItem name={"Reports"} link={"/bichard-ui/ReturnToReportIndex"} />}
              <UserManagementNavItem groups={groups} />
              <NavItem name={"Help"} link={"/help/"} />
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default NavBar

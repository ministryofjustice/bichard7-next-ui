import { useRouter } from "next/router"

interface NavItemProps {
  name: string
  link: string
}

const NavItem: React.FC<NavItemProps> = ({ name, link }: NavItemProps) => {
  const { asPath, basePath } = useRouter()
  const ariaCurrent = link === basePath + asPath ? "page" : undefined

  return (
    <li className="moj-primary-navigation__item">
      <a aria-current={ariaCurrent} className="moj-primary-navigation__link" href={link}>
        {name}
      </a>
    </li>
  )
}

const NavBar: React.FC = () => {
  return (
    <div className="moj-primary-navigation" role="navigation">
      <div className="moj-primary-navigation__container">
        <div className="moj-primary-navigation__nav">
          <nav className="moj-primary-navigation" aria-label="Primary navigation">
            <ul className="moj-primary-navigation__list">
              <NavItem name={"Case List"} link={"/bichard/"} />
              <NavItem name={"Reports"} link={"/bichard-ui/ReturnToReportIndex"} />
              <NavItem name={"Help"} link={"/help/"} />
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default NavBar

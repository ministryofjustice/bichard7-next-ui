interface Props {
  NavItemName: string
  NavItemLink: string
}

const NavItem: React.FC<Props> = ({ NavItemName, NavItemLink }: Props) => (
  <li className="moj-primary-navigation__item">
    <a className="moj-primary-navigation__link" aria-current="page" href={NavItemLink}>
      {NavItemName}
    </a>
  </li>
)

const NavBar: React.FC = () => (
  <div className="moj-primary-navigation">
    <div className="moj-primary-navigation__container">
      <div className="moj-primary-navigation__nav">
        <nav className="moj-primary-navigation" aria-label="Primary navigation">
          <ul className="moj-primary-navigation__list">
            <NavItem NavItemName={"Help"} NavItemLink={"https://www.google.co.uk"} />
          </ul>
        </nav>
      </div>
    </div>
  </div>
)

export default NavBar

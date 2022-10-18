const NavItem: React.FC = ({ NavItem, NavItemLink }) => (
  <li className="moj-primary-navigation__item">
    <a className="moj-primary-navigation__link" aria-current="page" href={NavItemLink}>
      {NavItem}
    </a>
  </li>
)

const NavBar: React.FC = () => (
  <div className="moj-primary-navigation">
    <div className="moj-primary-navigation__container">
      <div className="moj-primary-navigation__nav">
        <nav className="moj-primary-navigation" aria-label="Primary navigation">
          <ul className="moj-primary-navigation__list">
            <NavItem />
            <NavItem />
            <NavItem />
          </ul>
        </nav>
      </div>
    </div>
  </div>
)

export default NavBar

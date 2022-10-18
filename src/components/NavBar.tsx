import NavItem from "./NavItem"

const NavBar: React.FC = () => (
  <div className="moj-primary-navigation">
    <div className="moj-primary-navigation__container">
      <div className="moj-primary-navigation__nav">
        <nav className="moj-primary-navigation" aria-label="Primary navigation">
          <ul className="moj-primary-navigation__list">
            {/* TODO: Add help link */}
            <NavItem NavItemName={"Help"} NavItemLink={"https://www.google.co.uk"} />
          </ul>
        </nav>
      </div>
    </div>
  </div>
)

export default NavBar

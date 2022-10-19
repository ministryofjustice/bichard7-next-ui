import NavItem from "./NavItem"

const NavBar: React.FC = () => {
  return (
    <div className="moj-primary-navigation">
      <div className="moj-primary-navigation__container">
        <div className="moj-primary-navigation__nav">
          <nav className="moj-primary-navigation" aria-label="Primary navigation">
            <ul className="moj-primary-navigation__list">
              {/* TODO: need to add logic to swap aria-current to be active on currently selected page. Currently hard coded to CaseList */}
              <NavItem NavItemName={"Case List"} aria-current="page" NavItemLink={"/"} />
              <NavItem NavItemName={"Help"} aria-current="false" NavItemLink={"/help/"} />
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default NavBar

import { createUseStyles } from "react-jss"
import NavItem from "./NavItem"

const useStyles = createUseStyles({
  "moj-primary-navigation": {
    background: "transparent"
  }
})

const NavBar: React.FC = () => {
  const classes = useStyles()
  return (
    <div className={classes["moj-primary-navigation"]}>
      <div className="moj-primary-navigation__container">
        <div className="moj-primary-navigation__nav">
          <nav className="moj-primary-navigation" aria-label="Primary navigation">
            <ul className="moj-primary-navigation__list">
              {/* TODO: Add help link */}
              <NavItem NavItemName={"Help"} NavItemLink={"/help/"} />
              <NavItem NavItemName={"Help"} NavItemLink={"/help/"} />

              <NavItem NavItemName={"Help"} NavItemLink={"/help/"} />
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default NavBar

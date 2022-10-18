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

export default NavItem

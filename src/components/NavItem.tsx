import { useRouter } from "next/router"

interface Props {
  NavItemName: string
  NavItemLink: string
}

const NavItem: React.FC<Props> = ({ NavItemName, NavItemLink }: Props) => {
  const { asPath } = useRouter()
  const ariaCurrent = NavItemLink === asPath ? "page" : undefined
  return (
    <li className="moj-primary-navigation__item">
      <a aria-current={ariaCurrent} className="moj-primary-navigation__link" href={NavItemLink}>
        {NavItemName}
      </a>
    </li>
  )
}

export default NavItem

import type { ReactEventHandler } from "react"
import styled from "styled-components"

interface Props extends React.ComponentProps<"a"> {
  children: React.ReactNode
  className?: string
  onClick?: ReactEventHandler
}

const ActionLinkButton = styled.button`
  background: none;
  border: none;
  color: #1d70b8;
  cursor: pointer;
  padding: 0;
  text-align: left;
  text-decoration: underline;
  font-size: inherit;
`

const ActionLink = ({ children, className, onClick }: Props) => {
  return (
    <ActionLinkButton onClick={onClick} className={`${className} moj-action-link`}>
      {children}
    </ActionLinkButton>
  )
}

export default ActionLink

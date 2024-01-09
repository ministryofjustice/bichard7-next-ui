import styled from "styled-components"

interface Props {
  children: React.ReactNode
}

const StyledButtonsGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 50px;

  & > * {
    flex: 0 1 1%;
  }

  & > button {
    white-space: nowrap;
  }
`

const ButtonsGroup = ({ children }: Props) => <StyledButtonsGroup>{children}</StyledButtonsGroup>

export default ButtonsGroup

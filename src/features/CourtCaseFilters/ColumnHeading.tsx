import { ReactNode } from "react"
import styled from "styled-components"

const ColumnContainer = styled.div`
  width: fit-content;
  display: flex;
  align-items: flex-end;
`

const ColumnContent = styled.div`
  display: inline-block;
  vertical-align: bottom;
  margin-bottom: 7px;
`

interface Props {
  children?: ReactNode
}

const ColumnHeading: React.FC<Props> = ({ children }) => {
  return (
    <ColumnContainer className={"container"}>
      <ColumnContent className={"content"}>{children}</ColumnContent>
    </ColumnContainer>
  )
}

export default ColumnHeading

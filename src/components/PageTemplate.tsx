import { ReactNode } from "react"
import styled from "styled-components"

const GovukWidthContainer = styled.div`
  max-width: 100%;
  padding: 30px 40px;
`

interface Props {
  children: ReactNode
}

const PageTemplate = ({ children }: Props) => {
  return (
    <GovukWidthContainer className={"govuk-width-container"}>
      <main id="main-content" role="main">
        {children}
      </main>
    </GovukWidthContainer>
  )
}

export default PageTemplate

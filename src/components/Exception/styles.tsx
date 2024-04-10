import { GridRow } from "govuk-react"
import styled from "styled-components"

export const ExceptionRow = styled.div`
  &:not(:last-child): {
    margin-bottom: 1.25rem;
  }
`

export const ExceptionRowHelp = styled(GridRow)`
  margin-top: 0.62rem;
`

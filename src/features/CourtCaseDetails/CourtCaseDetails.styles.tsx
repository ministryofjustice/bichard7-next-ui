import { GridCol, GridRow } from "govuk-react"
import styled from "styled-components"

const PanelsGridRow = styled(GridRow)`
  @media (max-width: 1024px) {
    max-width: 100%;
    min-width: 100%;
    width: 100%;
    display: block;
  }
`

const PanelsGridCol = styled(GridCol)`
  overflow-x: scroll;

  @media (max-width: 1024px) {
    max-width: 100%;
    min-width: 100%;
    width: 100%;
    display: block;
  }
`

const SideBar = styled(GridCol)`
  min-width: 320px;
  max-width: 100%;
  @media (max-width: 1024px) {
    padding-top: 50px;
    max-width: 100%;
    min-width: 100%;
    width: 100%;
    display: block;
  }
`

export { PanelsGridCol, PanelsGridRow, SideBar }

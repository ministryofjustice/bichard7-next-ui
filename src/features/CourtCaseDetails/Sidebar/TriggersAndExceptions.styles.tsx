import { Tabs } from "govuk-react"
import styled from "styled-components"

const TabList = styled(Tabs.List)`
  & > li:only-child {
    display: flex;
    border-bottom: 1px solid #bfc1c3;

    a {
      flex-grow: 1;
      margin-right: 0;
      cursor: default;
      pointer-events: none;
    }
  }
`

const SideBar = styled.div`
  margin-top: -41px;
`

const TabContent = styled.div`
  cursor: pointer;
  font-weight: bold;
`

const TabContainer = styled.div`
  cursor: pointer;
`

const TablePanel = styled(Tabs.Panel)`
  padding-top: 10px;
`

export { SideBar, TabContainer, TabContent, TabList, TablePanel }

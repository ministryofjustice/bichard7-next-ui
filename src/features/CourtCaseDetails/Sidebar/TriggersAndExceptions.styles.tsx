import { Tabs } from "govuk-react"
import styled from "styled-components"

const TabList = styled(Tabs.List)`
  li {
    cursor: pointer;
  }

  & > li:only-child {
    display: flex;
    border-bottom: 1px solid #bfc1c3;

    a {
      flex-grow: 1;
      margin-right: 0;
      cursor: pointer;
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

const TablePanel = styled(Tabs.Panel)`
  padding-top: 10px;
`

export { SideBar, TabContent, TabList, TablePanel }

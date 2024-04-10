import styled from "styled-components"
import ConditionalRender from "../ConditionalRender"
import CasesPerPage from "./CasesPerPage"
import PaginationNavigation from "./PaginationNavigation"
import PaginationResults from "./PaginationResults"

interface Props {
  pageNum: number
  casesPerPage: number
  totalCases: number
  name?: string
}

const PaginationBar = styled.div`
  display: inline-flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  width: 99%;
`

const Pagination: React.FC<Props> = ({ pageNum, casesPerPage, totalCases, name }: Props) => {
  return (
    <ConditionalRender isRendered={totalCases > 0}>
      <PaginationBar id={`${name}-pagination-bar`} className={"pagination-bar"}>
        <PaginationResults pageNum={pageNum} casesPerPage={casesPerPage} totalCases={totalCases} />
        <CasesPerPage
          pageNum={pageNum}
          casesPerPage={casesPerPage}
          options={[25, 50, 100, 200]}
          selected={casesPerPage}
        />
        <PaginationNavigation pageNum={pageNum} totalPages={Math.ceil(totalCases / casesPerPage)} name={name} />
      </PaginationBar>
    </ConditionalRender>
  )
}

export default Pagination

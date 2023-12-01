import CasesPerPage from "./CasesPerPage"
import { createUseStyles } from "react-jss"
import PaginationResults from "./PaginationResults"
import PaginationNavigation from "./PaginationNavigation"
import ConditionalRender from "../ConditionalRender"

interface Props {
  pageNum: number
  casesPerPage: number
  totalCases: number
  name?: string
}

const useStyles = createUseStyles({
  "pagination-bar": {
    display: "inline-flex",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    alignItems: "center",
    width: "99%"
  }
})

const Pagination: React.FC<Props> = ({ pageNum, casesPerPage, totalCases, name }: Props) => {
  const classes = useStyles()

  return (
    <ConditionalRender isRendered={totalCases > 0}>
      <div id={`${name}-pagination-bar`} className={classes["pagination-bar"]}>
        <PaginationResults pageNum={pageNum} casesPerPage={casesPerPage} totalCases={totalCases} />
        <CasesPerPage
          pageNum={pageNum}
          casesPerPage={casesPerPage}
          options={[25, 50, 100, 200]}
          selected={casesPerPage}
        />
        <PaginationNavigation pageNum={pageNum} totalPages={Math.ceil(totalCases / casesPerPage)} name={name} />
      </div>
    </ConditionalRender>
  )
}

export default Pagination

import CasesPerPage from "./CasesPerPage"
import { createUseStyles } from "react-jss"
import PaginationResults from "./PaginationResults"
import PaginationNavigation from "./PaginationNavigation"

interface Props {
  pageNum: number
  casesPerPage: number
  totalCases: number
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

const Pagination: React.FC<Props> = ({ pageNum, casesPerPage, totalCases }: Props) => {
  const classes = useStyles()

  return (
    <div className={classes["pagination-bar"]}>
      <PaginationResults pageNum={pageNum} resultsPerPage={casesPerPage} totalCases={totalCases} />
      <CasesPerPage options={[5, 10, 25, 100]} selected={casesPerPage} />
      <PaginationNavigation pageNum={pageNum} totalPages={Math.ceil(totalCases / casesPerPage)} />
    </div>
  )
}

export default Pagination

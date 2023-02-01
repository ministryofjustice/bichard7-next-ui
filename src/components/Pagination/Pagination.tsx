import ResultsPerPage from "./ResultsPerPage"
import { createUseStyles } from "react-jss"
import PaginationResults from "./PaginationResults"
import PaginationNavigation from "./PaginationNavigation"

interface Props {
  pageNum: number
  resultsPerPage: number
  totalCases: number
}

const useStyles = createUseStyles({
  "bottom-navigation": {
    display: "inline-flex",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    alignItems: "center",
    width: "99%"
  }
})

const Pagination: React.FC<Props> = ({ pageNum, resultsPerPage, totalCases }: Props) => {
  const classes = useStyles()

  return (
    <div className={classes["bottom-navigation"]}>
      <PaginationResults pageNum={pageNum} resultsPerPage={resultsPerPage} totalCases={totalCases} />
      <ResultsPerPage options={[5, 10, 25, 100]} selected={resultsPerPage} />
      <PaginationNavigation pageNum={pageNum} totalPages={Math.ceil(totalCases / resultsPerPage)} />
    </div>
  )
}

export default Pagination

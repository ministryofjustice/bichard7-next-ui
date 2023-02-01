interface Props {
  pageNum: number
  resultsPerPage: number
  totalCases: number
}

const PaginationResults: React.FC<Props> = ({ pageNum, resultsPerPage, totalCases }: Props) => {
  return (
    <p className={"moj-pagination__results"}>
      {"Showing "}
      <b>{(pageNum - 1) * resultsPerPage + 1}</b>
      {" to "}
      <b>{Math.min(pageNum * resultsPerPage, totalCases)}</b>
      {" of "}
      <b>{totalCases}</b>
      {" cases"}
    </p>
  )
}

export default PaginationResults

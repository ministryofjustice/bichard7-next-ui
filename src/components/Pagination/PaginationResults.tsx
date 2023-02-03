interface Props {
  pageNum: number
  casesPerPage: number
  totalCases: number
}

const PaginationResults: React.FC<Props> = ({ pageNum, casesPerPage, totalCases }: Props) => {
  return (
    <p className={"moj-pagination__results"}>
      {"Showing "}
      <b>{(pageNum - 1) * casesPerPage + 1}</b>
      {" to "}
      <b>{Math.min(pageNum * casesPerPage, totalCases)}</b>
      {" of "}
      <b>{totalCases}</b>
      {" cases"}
    </p>
  )
}

export default PaginationResults

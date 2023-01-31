import { useRouter } from "next/router"
import { Pagination as GovPagination } from "govuk-react"
import ResultsPerPage from "./ResultsPerPage"

interface Props {
  totalPages: number
  pageNum: number
  resultsPerPage: number
}

const Pagination: React.FC<Props> = ({ totalPages, pageNum, resultsPerPage }: Props) => {
  const { basePath, query } = useRouter()

  return (
    <GovPagination>
      {pageNum > 1 && (
        <GovPagination.Anchor
          pageTitle={`${pageNum - 1} of ${totalPages}`}
          previousPage
          href={`${basePath}?${new URLSearchParams({ ...query, pageNum: `${pageNum - 1}` })}`}
        >
          {"Previous page"}
        </GovPagination.Anchor>
      )}
      <ResultsPerPage options={[5, 10, 15, 20, 25]} selected={resultsPerPage || 0} />
      {pageNum < totalPages && (
        <GovPagination.Anchor
          nextPage
          pageTitle={`${pageNum + 1} of ${totalPages}`}
          href={`${basePath}?${new URLSearchParams({ ...query, pageNum: `${pageNum + 1}` })}`}
        >
          {"Next page"}
        </GovPagination.Anchor>
      )}
    </GovPagination>
  )
}

export default Pagination

import { useRouter } from "next/router"
import { Pagination as GovPagination } from "govuk-react"

interface Props {
  totalPages: number
  pageNum: number
}

const Pagination: React.FC<Props> = ({ totalPages, pageNum }: Props) => {
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

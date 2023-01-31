import { useRouter } from "next/router"
import Link from "next/link"
import { generatePageLinks } from "./generatePageLinks"
import ResultsPerPage from "./ResultsPerPage"

interface Props {
  totalPages: number
  pageNum: number
  resultsPerPage: number
}

const Pagination: React.FC<Props> = ({ totalPages, pageNum, resultsPerPage }: Props) => {
  const { query } = useRouter()

  const pageLinks = generatePageLinks(pageNum, totalPages)

  return (
    <nav className="moj-pagination" aria-label="Pagination navigation">
      <p className="moj-pagination__results">
        {"Showing "}
        <b>{(pageNum - 1) * resultsPerPage}</b>
        {" to "}
        <b>{pageNum * resultsPerPage}</b>
        {" of "}
        {/* TODO: the total number of results will be less than this when the last page isn't full */}
        <b>{totalPages * resultsPerPage}</b>
        {" cases"}
      </p>

      <ResultsPerPage options={[5, 10, 25, 100]} selected={resultsPerPage} />

      <ul className="moj-pagination__list">
        {pageLinks.map((pageLink, index) => {
          const labelText = pageLink.label === "Ellipsis" ? "…" : pageLink.label.toString()
          const label = pageLink.bold ? <b>{labelText}</b> : labelText
          const paginationItem = pageLink.destinationPage ? (
            <Link href={{ query: { ...query, pageNum: pageLink.destinationPage } }} className="moj-pagination__link">
              {label}
            </Link>
          ) : (
            label
          )

          return <li key={index}>{paginationItem}</li>
        })}
      </ul>
    </nav>
  )
}

export default Pagination

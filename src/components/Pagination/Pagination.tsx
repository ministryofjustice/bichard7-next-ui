import { useRouter } from "next/router"
import Link from "next/link"
import { generatePageLinks } from "./generatePageLinks"
import ResultsPerPage from "./ResultsPerPage"
import { UrlObject } from "url"
import { createUseStyles } from "react-jss"

interface RelativeNavigationProps {
  className: string
  label: string
  link: UrlObject
}

const RelativeNavigation: React.FC<RelativeNavigationProps> = ({ className, label, link }: RelativeNavigationProps) => (
  <li className={`moj-pagination__item moj-pagination__item--${className}`}>
    <Link className="moj-pagination__link" href={link}>
      {label}
      <span className="govuk-visually-hidden">{" page"}</span>
    </Link>
  </li>
)

interface PageNumProps {
  pageNum: number
  totalPages: number
  className?: string
  link?: UrlObject
}

const PageNum: React.FC<PageNumProps> = ({ pageNum, totalPages, className, link }: PageNumProps) => {
  const label = !!link ? (
    <>
      <Link className="moj-pagination__link" href={link} aria-label={`Page ${pageNum} of ${totalPages}`}>
        {pageNum}
      </Link>
    </>
  ) : (
    pageNum
  )
  return <li className={"moj-pagination__item" + (className ? " " + className : "")}>{label}</li>
}

const Ellipsis = () => <li className="moj-pagination__item moj-pagination__item--dots">{"…"}</li>

interface Props {
  totalPages: number
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

const Pagination: React.FC<Props> = ({ totalPages, pageNum, resultsPerPage, totalCases }: Props) => {
  const { query } = useRouter()
  const pageLinks = generatePageLinks(pageNum, totalPages)
  const classes = useStyles()

  return (
    <div className={classes["bottom-navigation"]}>
      <p className={"moj-pagination__results"} id="pagination-results">
        {"Showing "}
        <b>{(pageNum - 1) * resultsPerPage + 1}</b>
        {" to "}
        <b>{Math.min(pageNum * resultsPerPage, totalCases)}</b>
        {" of "}
        <b>{totalCases}</b>
        {" cases"}
      </p>

      <ResultsPerPage options={[5, 10, 25, 100]} selected={resultsPerPage} className={"moj-pagination__results"} />

      <nav className={"moj-pagination"} aria-label="Pagination navigation">
        <ul className="moj-pagination__list">
          {pageLinks.map((pageLink, index) => {
            if (pageLink.label === "Previous") {
              return (
                <RelativeNavigation
                  className={"prev"}
                  label="Previous"
                  link={{ query: { ...query, pageNum: pageLink.destinationPage } }}
                  key={index}
                />
              )
            } else if (pageLink.label === "Next") {
              return (
                <RelativeNavigation
                  className={"next"}
                  label="Next"
                  link={{ query: { ...query, pageNum: pageLink.destinationPage } }}
                  key={index}
                />
              )
            } else if (pageLink.label === "Ellipsis") {
              return <Ellipsis key={index} />
            } else if (!pageLink.destinationPage) {
              return (
                <PageNum
                  pageNum={pageLink.label}
                  totalPages={totalPages}
                  className="moj-pagination__item--active"
                  key={index}
                />
              )
            } else {
              return (
                <PageNum
                  pageNum={pageLink.label}
                  totalPages={totalPages}
                  link={{ query: { ...query, pageNum: pageLink.destinationPage } }}
                  key={index}
                />
              )
            }
          })}
        </ul>
      </nav>
    </div>
  )
}

export default Pagination

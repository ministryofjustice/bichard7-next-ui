import FilterTag from "components/FilterTag/FilterTag"
import If from "components/If"
import { useRouter } from "next/router"
import { Filter } from "types/CaseListQueryParams"
import deleteQueryParam from "utils/deleteQueryParam"

interface Props {
  filters: {
    courtCaseTypes?: Filter[]
    keywords?: string[]
    dateRange?: string | null
    urgency?: boolean
  }
}

const AppliedFilters: React.FC<Props> = ({ filters }: Props) => {
  const { basePath, query } = useRouter()

  const hasAnyAppliedFilters = (): boolean =>
    (filters.courtCaseTypes && filters.courtCaseTypes.length > 0) ||
    (filters.keywords && filters.keywords.length > 0) ||
    !!filters.urgency ||
    !!filters.dateRange

  const removeQueryParamFromPath = (paramToRemove: { [key: string]: string }): string => {
    const searchParams = deleteQueryParam(paramToRemove, query)

    return `${basePath}/?${searchParams}`
  }

  return (
    <div>
      <If condition={hasAnyAppliedFilters()}>
        <ul key={"applied-filters"} className="moj-filter-tags">
          <li>
            <p className="govuk-heading-s govuk-!-margin-bottom-0">{"Filters applied:"}</p>
          </li>
          {filters.courtCaseTypes &&
            filters.courtCaseTypes.map((courtCaseType) => {
              return (
                <li key={`${courtCaseType}`}>
                  <FilterTag tag={courtCaseType} href={removeQueryParamFromPath({ type: courtCaseType })} />
                </li>
              )
            })}
          {filters.keywords &&
            filters.keywords.map((keyword) => {
              return (
                <li key={`${keyword}`}>
                  <FilterTag tag={keyword} href={removeQueryParamFromPath({ keywords: keyword })} />
                </li>
              )
            })}
          <If condition={!!filters.dateRange}>
            <li>
              <FilterTag
                tag={filters.dateRange ?? ""}
                href={removeQueryParamFromPath({ dateRange: filters.dateRange ?? "" })}
              />
            </li>
          </If>
          <If condition={!!filters.urgency}>
            <li>
              <FilterTag tag={"Urgent"} href={removeQueryParamFromPath({ urgency: "Urgent" })} />
            </li>
          </If>
          <li>
            <p className="moj-filter__heading-action" id="clear-filters-applied">
              <a className="govuk-link govuk-link--no-visited-state" href="/bichard">
                {"Clear filters"}
              </a>
            </p>
          </li>
        </ul>
      </If>
    </div>
  )
}

export default AppliedFilters

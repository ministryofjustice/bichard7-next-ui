import FilterTag from "components/FilterTag/FilterTag"
import If from "components/If"
import { useRouter } from "next/router"
import { Reason } from "types/CaseListQueryParams"
import { caseStateLabels, myCaseStateFilters } from "utils/caseStateFilters"
import { deleteQueryParam, deleteQueryParamsByName } from "utils/deleteQueryParam"

interface Props {
  filters: {
    courtCaseTypes?: Reason[]
    keywords?: string[]
    courtName?: string | null
    reasonSearch?: string | null
    ptiurn?: string | null
    dateRange?: string | null
    urgency?: string | null
    locked?: string | null
    caseState?: string | null
    myCaseState?: string | null
  }
}

const AppliedFilters: React.FC<Props> = ({ filters }: Props) => {
  const { basePath, query } = useRouter()

  const hasAnyAppliedFilters = (): boolean =>
    (filters.courtCaseTypes && filters.courtCaseTypes.length > 0) ||
    (filters.keywords && filters.keywords.length > 0) ||
    !!filters.courtName ||
    !!filters.reasonSearch ||
    !!filters.ptiurn ||
    !!filters.urgency ||
    !!filters.dateRange ||
    !!filters.locked ||
    !!filters.caseState ||
    !!filters.myCaseState

  const removeQueryParamFromPath = (paramToRemove: { [key: string]: string }): string => {
    deleteQueryParamsByName(["pageNum"], query)
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
          <If condition={!!filters.courtName}>
            <li>
              <FilterTag
                tag={filters.courtName ?? ""}
                href={removeQueryParamFromPath({ courtName: filters.courtName ?? "" })}
              />
            </li>
          </If>
          <If condition={!!filters.reasonSearch}>
            <li>
              <FilterTag
                tag={filters.reasonSearch ?? ""}
                href={removeQueryParamFromPath({ reasonSearch: filters.reasonSearch ?? "" })}
              />
            </li>
          </If>
          <If condition={!!filters.ptiurn}>
            <li>
              <FilterTag tag={filters.ptiurn ?? ""} href={removeQueryParamFromPath({ ptiurn: filters.ptiurn ?? "" })} />
            </li>
          </If>
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
              <FilterTag
                tag={filters.urgency ?? ""}
                href={removeQueryParamFromPath({ urgency: filters.urgency ?? "" })}
              />
            </li>
          </If>
          <If condition={!!filters.myCaseState}>
            <li>
              <FilterTag
                tag={myCaseStateFilters ?? ""}
                href={removeQueryParamFromPath({ myCases: filters.myCaseState ?? "" })}
              />
            </li>
          </If>
          <If condition={!!filters.locked}>
            <li>
              <FilterTag tag={filters.locked ?? ""} href={removeQueryParamFromPath({ locked: filters.locked ?? "" })} />
            </li>
          </If>
          <If condition={!!filters.caseState}>
            <li>
              <FilterTag
                tag={caseStateLabels[String(filters.caseState)] ?? ""}
                href={removeQueryParamFromPath({ state: filters.caseState ?? "" })}
              />
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

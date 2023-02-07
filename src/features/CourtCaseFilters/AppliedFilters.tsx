import FilterTag from "components/FilterTag/FilterTag"
import If from "components/If"
import { format } from "date-fns"
import { useRouter } from "next/router"
import { encode } from "querystring"
import { Reason } from "types/CaseListQueryParams"
import { caseStateLabels } from "utils/caseStateFilters"
import { deleteQueryParam, deleteQueryParamsByName } from "utils/deleteQueryParam"

interface Props {
  filters: {
    courtCaseTypes?: Reason[]
    keywords?: string[]
    courtName?: string | null
    reasonSearch?: string | null
    ptiurn?: string | null
    dateRange?: string | null
    customDateFrom?: Date | null
    customDateTo?: Date | null
    urgency?: string | null
    locked?: string | null
    caseState?: string | null
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
    !!filters.customDateFrom ||
    !!filters.customDateTo ||
    !!filters.locked ||
    !!filters.caseState

  const removeQueryParamFromPath = (paramToRemove: { [key: string]: string }): string => {
    let searchParams = deleteQueryParam(paramToRemove, query)
    searchParams = deleteQueryParamsByName(["pageNum"], searchParams)

    return `${basePath}/?${searchParams}`
  }

  const removeQueryParamsByName = (paramsToRemove: string[]): string => {
    let searchParams = new URLSearchParams(encode(query))
    searchParams = deleteQueryParamsByName(paramsToRemove, searchParams)
    return `${basePath}/?${searchParams}`
  }

  // TODO: created a new function that takes in multiple params and deletes them from query. Issue we had was that the deleteQueryParams function did not like the result type having undefined.
  // const removeQueryParamsFromPath = (paramsToRemove: { [key: string[]]: string[] }): string => {
  //   deleteQueryParamsByName(["pageNum"], query)
  //   const searchParams = deleteQueryParam(paramsToRemove, query)

  //   return `${basePath}/?${searchParams}`
  // }

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
          <If condition={!!filters.customDateFrom && !!filters.customDateTo}>
            <li>
              <FilterTag
                tag={
                  `${format(filters.customDateFrom || new Date(), "dd/MM/yyyy")} - ${format(
                    filters.customDateTo || new Date(),
                    "dd/MM/yyyy"
                  )}` ?? ""
                }
                // TODO update deleteQueryParams
                href={removeQueryParamsByName(["from", "to"])}
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
          <If condition={!!filters.caseState}>
            <li>
              <FilterTag
                tag={caseStateLabels[String(filters.caseState)] ?? ""}
                href={removeQueryParamFromPath({ state: filters.caseState ?? "" })}
              />
            </li>
          </If>
          <If condition={!!filters.locked}>
            <li>
              <FilterTag tag={filters.locked ?? ""} href={removeQueryParamFromPath({ locked: filters.locked ?? "" })} />
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

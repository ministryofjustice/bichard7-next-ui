import FilterTag from "components/FilterTag/FilterTag"
import If from "components/If"
import { format } from "date-fns"
import { useRouter } from "next/router"
import { encode } from "querystring"
import { Reason } from "types/CaseListQueryParams"
import { caseStateLabels } from "utils/caseStateFilters"
import { deleteQueryParam, deleteQueryParamsByName } from "utils/deleteQueryParam"
import { displayedDateFormat } from "utils/formattedDate"

interface Props {
  filters: {
    courtCaseTypes?: Reason[]
    keywords?: string[]
    courtName?: string | null
    reasonCode?: string | null
    ptiurn?: string | null
    dateRange?: string | null
    customDateFrom?: Date | null
    customDateTo?: Date | null
    urgency?: string | null
    locked?: string | null
    caseState?: string | null
    myCases?: boolean
  }
}

const AppliedFilters: React.FC<Props> = ({ filters }: Props) => {
  const { basePath, query } = useRouter()

  const hasAnyAppliedFilters = (): boolean =>
    (filters.courtCaseTypes && filters.courtCaseTypes.length > 0) ||
    (filters.keywords && filters.keywords.length > 0) ||
    !!filters.courtName ||
    !!filters.reasonCode ||
    !!filters.ptiurn ||
    !!filters.urgency ||
    !!filters.dateRange ||
    !!filters.customDateFrom ||
    !!filters.customDateTo ||
    !!filters.locked ||
    !!filters.caseState ||
    !!filters.myCases

  const removeFilterFromPath = (paramToRemove: { [key: string]: string }): string => {
    let searchParams = deleteQueryParam(paramToRemove, query)
    searchParams = deleteQueryParamsByName(["pageNum"], searchParams)

    return `${basePath}/?${searchParams}`
  }

  const removeQueryParamsByName = (paramsToRemove: string[]): string => {
    let searchParams = new URLSearchParams(encode(query))
    searchParams = deleteQueryParamsByName(paramsToRemove, searchParams)
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
                  <FilterTag tag={courtCaseType} href={removeFilterFromPath({ type: courtCaseType })} />
                </li>
              )
            })}
          {filters.keywords &&
            filters.keywords.map((keyword) => {
              return (
                <li key={`${keyword}`}>
                  <FilterTag tag={keyword} href={removeFilterFromPath({ keywords: keyword })} />
                </li>
              )
            })}
          <If condition={!!filters.courtName}>
            <li>
              <FilterTag
                tag={filters.courtName ?? ""}
                href={removeFilterFromPath({ courtName: filters.courtName ?? "" })}
              />
            </li>
          </If>
          <If condition={!!filters.reasonCode}>
            <li>
              <FilterTag
                tag={filters.reasonCode ?? ""}
                href={removeFilterFromPath({ reasonCode: filters.reasonCode ?? "" })}
              />
            </li>
          </If>
          <If condition={!!filters.ptiurn}>
            <li>
              <FilterTag tag={filters.ptiurn ?? ""} href={removeFilterFromPath({ ptiurn: filters.ptiurn ?? "" })} />
            </li>
          </If>
          <If condition={!!filters.dateRange}>
            <li>
              <FilterTag
                tag={filters.dateRange ?? ""}
                href={removeFilterFromPath({ dateRange: filters.dateRange ?? "" })}
              />
            </li>
          </If>
          <If condition={!!filters.customDateFrom && !!filters.customDateTo}>
            <li>
              <FilterTag
                tag={
                  `${format(filters.customDateFrom || new Date(), displayedDateFormat)} - ${format(
                    filters.customDateTo || new Date(),
                    displayedDateFormat
                  )}` ?? ""
                }
                href={removeQueryParamsByName(["from", "to", "pageNum"])}
              />
            </li>
          </If>
          <If condition={!!filters.urgency}>
            <li>
              <FilterTag tag={filters.urgency ?? ""} href={removeFilterFromPath({ urgency: filters.urgency ?? "" })} />
            </li>
          </If>
          <If condition={!!filters.myCases}>
            <li>
              <FilterTag
                tag={"Cases locked to me" ?? ""}
                href={removeFilterFromPath({ myCases: String(filters.myCases) })}
              />
            </li>
          </If>
          <If condition={!!filters.locked}>
            <li>
              <FilterTag tag={filters.locked ?? ""} href={removeFilterFromPath({ locked: filters.locked ?? "" })} />
            </li>
          </If>
          <If condition={!!filters.caseState}>
            <li>
              <FilterTag
                tag={caseStateLabels[String(filters.caseState)] ?? ""}
                href={removeFilterFromPath({ state: filters.caseState ?? "" })}
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

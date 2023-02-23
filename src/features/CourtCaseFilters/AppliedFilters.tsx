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
    reasons?: Reason[]
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
    (filters.reasons && filters.reasons.length > 0) ||
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
      <If isRendered={hasAnyAppliedFilters()}>
        <ul key={"applied-filters"} className="moj-filter-tags">
          <li>
            <p className="govuk-heading-s govuk-!-margin-bottom-0">{"Filters applied:"}</p>
          </li>
          {filters.reasons &&
            filters.reasons.map((reason) => {
              return (
                <li key={`${reason}`}>
                  <FilterTag tag={reason} href={removeFilterFromPath({ type: reason })} />
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
          <If isRendered={!!filters.courtName}>
            <li>
              <FilterTag
                tag={filters.courtName ?? ""}
                href={removeFilterFromPath({ courtName: filters.courtName ?? "" })}
              />
            </li>
          </If>
          <If isRendered={!!filters.reasonCode}>
            <li>
              <FilterTag
                tag={filters.reasonCode ?? ""}
                href={removeFilterFromPath({ reasonCode: filters.reasonCode ?? "" })}
              />
            </li>
          </If>
          <If isRendered={!!filters.ptiurn}>
            <li>
              <FilterTag tag={filters.ptiurn ?? ""} href={removeFilterFromPath({ ptiurn: filters.ptiurn ?? "" })} />
            </li>
          </If>
          <If isRendered={!!filters.dateRange}>
            <li>
              <FilterTag
                tag={filters.dateRange ?? ""}
                href={removeFilterFromPath({ dateRange: filters.dateRange ?? "" })}
              />
            </li>
          </If>
          <If isRendered={!!filters.customDateFrom && !!filters.customDateTo}>
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
          <If isRendered={!!filters.urgency}>
            <li>
              <FilterTag tag={filters.urgency ?? ""} href={removeFilterFromPath({ urgency: filters.urgency ?? "" })} />
            </li>
          </If>
          <If isRendered={!!filters.myCases}>
            <li>
              <FilterTag
                tag={"Cases locked to me" ?? ""}
                href={removeFilterFromPath({ myCases: String(filters.myCases) })}
              />
            </li>
          </If>
          <If isRendered={!!filters.locked}>
            <li>
              <FilterTag tag={filters.locked ?? ""} href={removeFilterFromPath({ locked: filters.locked ?? "" })} />
            </li>
          </If>
          <If isRendered={!!filters.caseState}>
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

import FilterTag from "components/FilterTag/FilterTag"
import If from "components/If"
import { useRouter } from "next/router"
import { Filter } from "types/CaseListQueryParams"
import deleteQueryParam from "utils/deleteQueryParam"

interface Props {
  courtCaseTypes: Filter[]
  keywords: string[]
  urgency?: boolean
}

const AppliedFilters: React.FC<Props> = ({ courtCaseTypes, keywords, urgency }: Props) => {
  const { basePath, query } = useRouter()

  const hasAnyAppliedFilters = (): boolean => courtCaseTypes.length > 0 || keywords.length > 0 || !!urgency

  const removeQueryParamFromPath = (paramToRemove: { [key: string]: string }): string => {
    const searchParams = deleteQueryParam(paramToRemove, query)

    return `${basePath}/?${searchParams}`
  }

  return (
    <div>
      <If condition={hasAnyAppliedFilters()}>
        <ul key={"applied-filters"} className="moj-filter-tags">
          <li>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-0">{"Filters applied:"}</h3>
          </li>
          {courtCaseTypes.map((t) => {
            return (
              <li key={`${t}`}>
                <FilterTag tag={t} href={removeQueryParamFromPath({ type: t })} />
              </li>
            )
          })}
          {keywords.map((keyword) => {
            return (
              <li key={`${keyword}`}>
                <FilterTag tag={keyword} href={removeQueryParamFromPath({ keywords: keyword })} />
              </li>
            )
          })}
          <If condition={!!urgency}>
            <li>
              <FilterTag tag={"Urgent"} href={removeQueryParamFromPath({ urgency: "Urgent" })} />
            </li>
          </If>
          <li>
            <p className="moj-filter__heading-action" id="clear-filters-applied">
              <a class="govuk-link govuk-link--no-visited-state" href="/bichard">
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

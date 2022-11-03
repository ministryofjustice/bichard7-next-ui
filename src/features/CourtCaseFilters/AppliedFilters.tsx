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
            <h3 className="govuk-heading-s govuk-!-margin-bottom-0">{"Applied filters:"}</h3>
          </li>
          {courtCaseTypes.map((t) => {
            return (
              <li key={`${t}`}>
                <a className="moj-filter__tag" href={removeQueryParamFromPath({ type: t })}>
                  <span className="govuk-visually-hidden">{`Remove ${t} filter`}</span>
                  {t}
                </a>
              </li>
            )
          })}
          {keywords.map((keyword) => {
            return (
              <li key={`${keyword}`}>
                <a className="moj-filter__tag" href={removeQueryParamFromPath({ keywords: keyword })}>
                  <span className="govuk-visually-hidden">{`Remove ${keyword} filter`}</span>
                  {keyword}
                </a>
              </li>
            )
          })}
          <If condition={!!urgency}>
            <li>
              <a className="moj-filter__tag" href={removeQueryParamFromPath({ urgency: "Urgent" })}>
                <span className="govuk-visually-hidden">{`Remove urgent filter`}</span>
                {"Urgent"}
              </a>
            </li>
          </If>
        </ul>
      </If>
    </div>
  )
}

export default AppliedFilters

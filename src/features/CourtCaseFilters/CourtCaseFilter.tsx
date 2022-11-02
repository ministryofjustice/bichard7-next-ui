import { HintText } from "govuk-react"
import { Filter } from "types/CaseListQueryParams"
import If from "components/If"
import { useRouter } from "next/router"
import deleteQueryParam from "utils/deleteQueryParam"

interface Props {
  courtCaseTypes: Filter[]
  keywords: string[]
}

const CourtCaseFilter: React.FC<Props> = ({ courtCaseTypes, keywords }: Props) => {
  const { basePath, query } = useRouter()

  const removeQueryParamFromPath = (paramToRemove: { [key: string]: string }): string => {
    const searchParams = deleteQueryParam(paramToRemove, query)

    return `${basePath}/?${searchParams}`
  }

  return (
    <form method={"get"}>
      <div className="moj-filter">
        <div className="moj-filter__header">
          <div className="moj-filter__header-title">
            <h2 className="govuk-heading-m">{"Filter"}</h2>
          </div>
          <div className="moj-filter__header-action"></div>
        </div>
        <div className="moj-filter__content">
          <div className="moj-filter__selected">
            <div className="moj-filter__selected-heading">
              <div className="moj-filter__heading-title">
                <h2 className="govuk-heading-m">{"Selected filters"}</h2>
              </div>
            </div>
            <If condition={courtCaseTypes.length > 0}>
              <h3 className="govuk-heading-s govuk-!-margin-bottom-0">{"Case type"}</h3>
              {courtCaseTypes.map((t) => {
                return (
                  <ul key={t} className="moj-filter-tags">
                    <li>
                      <a className="moj-filter__tag" href={removeQueryParamFromPath({ type: t })}>
                        <span className="govuk-visually-hidden">{`Remove ${t} filter`}</span>
                        {t}
                      </a>
                    </li>
                  </ul>
                )
              })}
            </If>
            <If condition={keywords.length > 0}>
              <h3 className="govuk-heading-s govuk-!-margin-bottom-0">{"Keywords"}</h3>
              {keywords.map((keyword) => {
                return (
                  <ul key={keyword} className="moj-filter-tags">
                    <li>
                      <a className="moj-filter__tag" href={removeQueryParamFromPath({ keywords: keyword })}>
                        <span className="govuk-visually-hidden">{`Remove ${keyword} filter`}</span>
                        {keyword}
                      </a>
                    </li>
                  </ul>
                )
              })}
            </If>
          </div>
          <div className="moj-filter__options">
            <button className="govuk-button" data-module="govuk-button" id="search">
              {"Apply filters"}
            </button>
            <div className="govuk-form-group">
              <label className="govuk-label govuk-label--m" htmlFor="keywords">
                {"Keywords"}
              </label>
              <HintText>{"Defendent name, Court name, Reason, PTIURN"}</HintText>
              <input className="govuk-input" id="keywords" name="keywords" type="text"></input>
            </div>
          </div>
          <div className="govuk-form-group">
            <fieldset className="govuk-fieldset">
              <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">{"Case type"}</legend>
              <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
                <div className="govuk-checkboxes__item">
                  <input
                    className="govuk-checkboxes__input"
                    id="exceptions-type"
                    name="type"
                    type="checkbox"
                    value="exceptions"
                  ></input>

                  <label className="govuk-label govuk-checkboxes__label" htmlFor="exceptions-type">
                    {"Exceptions"}
                  </label>
                </div>
                <div className="govuk-checkboxes__item">
                  <input
                    className="govuk-checkboxes__input"
                    id="triggers-type"
                    name="type"
                    type="checkbox"
                    value="triggers"
                  ></input>
                  <label className="govuk-label govuk-checkboxes__label" htmlFor="triggers-type">
                    {"Triggers"}
                  </label>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </form>
  )
}

export default CourtCaseFilter

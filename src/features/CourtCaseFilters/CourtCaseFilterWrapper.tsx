import { useCurrentUser } from "context/CurrentUserContext"
import { useEffect, useState } from "react"
import { Heading } from "govuk-react"
import { useRouter } from "next/router"

interface Props {
  filter: React.ReactNode
  courtCaseList: React.ReactNode
  appliedFilters: React.ReactNode
  paginationTop: React.ReactNode
  paginationBottom: React.ReactNode
}

const CourtCaseFilterWrapper: React.FC<Props> = ({
  filter,
  appliedFilters,
  courtCaseList,
  paginationTop,
  paginationBottom
}: Props) => {
  const user = useCurrentUser()
  const filterPanelKey = `is-filter-panel-visible-${user.username}`
  const [isSearchPanelShown, setIsSearchPanelShown] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const filterPanelValue = localStorage.getItem(filterPanelKey)
    if (filterPanelValue) {
      const storedDate = new Date(filterPanelValue)
      storedDate.setDate(storedDate.getDate() + 7)
      if (storedDate > new Date()) {
        setIsSearchPanelShown(false)
      } else {
        localStorage.removeItem(filterPanelKey)
        setIsSearchPanelShown(true)
      }
    }
  }, [filterPanelKey])

  return (
    <>
      <div className="moj-filter-layout__filter">
        <div className={isSearchPanelShown ? "moj-filter" : "moj-filter moj-hidden"}>{filter}</div>
      </div>
      <Heading className="hidden-header" as="h1" size="LARGE">
        {"Case list"}
      </Heading>
      <div className="moj-filter-layout__content">
        <div className="moj-button-menu">
          <div className="moj-action-bar">
            <button
              data-module="govuk-button"
              id="filter-button"
              className="govuk-button govuk-button--secondary govuk-!-margin-bottom-0"
              type="button"
              aria-haspopup="true"
              aria-expanded={isSearchPanelShown === true}
              onClick={() => {
                const showSearchPanel = !isSearchPanelShown
                if (!showSearchPanel) {
                  localStorage.setItem(filterPanelKey, new Date().toISOString())
                } else {
                  localStorage.removeItem(filterPanelKey)
                }
                setIsSearchPanelShown(showSearchPanel)
              }}
            >
              {isSearchPanelShown ? "Hide search panel" : "Show search panel"}
            </button>
            {!isSearchPanelShown && <div className="moj-button-menu__wrapper">{appliedFilters}</div>}
            <button
              data-module="govuk-button"
              id="export-button"
              className="govuk-button govuk-button--primary govuk-!-margin-bottom-0"
              type="button"
              onClick={() => {
                router.push({ pathname: "/download", query: router.query })
              }}
            >
              {"Export"}
            </button>
          </div>
        </div>

        {paginationTop}

        <div className="moj-scrollable-pane">
          <div className="moj-scrollable-pane__wrapper">{courtCaseList}</div>
        </div>

        {paginationBottom}
      </div>
    </>
  )
}

export default CourtCaseFilterWrapper

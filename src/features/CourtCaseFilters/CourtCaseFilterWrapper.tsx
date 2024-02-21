import { useCurrentUser } from "context/CurrentUserContext"
import { useEffect, useState } from "react"
import { Heading } from "govuk-react"

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
  const [areAppliedFiltersShown, setAreAppliedFiltersShown] = useState(false)
  const dateTime = new Date().getTime()

  useEffect(() => {
    setAreAppliedFiltersShown(localStorage.getItem(filterPanelKey) === "true")
  }, [filterPanelKey])

  return (
    <>
      <div className="moj-filter-layout__filter">
        <div className={!areAppliedFiltersShown ? "moj-filter" : "moj-filter moj-hidden"}>{filter}</div>
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
              aria-expanded="false"
              onClick={() => {
                const newValue = !areAppliedFiltersShown
                localStorage.setItem(filterPanelKey, newValue.toString())
                localStorage.setItem("dateTime", JSON.stringify(dateTime))
                setAreAppliedFiltersShown(newValue)
              }}
            >
              {areAppliedFiltersShown ? "Show search panel" : "Hide search panel"}
            </button>
            {!areAppliedFiltersShown && <div className="moj-button-menu__wrapper">{appliedFilters}</div>}
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

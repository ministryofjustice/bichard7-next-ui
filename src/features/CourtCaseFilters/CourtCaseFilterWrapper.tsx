interface Props {
  filter: React.ReactNode
  courtCaseList: React.ReactNode
  appliedFilters: React.ReactNode
  pagination: React.ReactNode
}

const toggleFilter = () => {
  const $filter = document.querySelector(".moj-filter")
  const $button = document.querySelector("#filter-button")
  if ($filter && $button) {
    $filter.classList.toggle("moj-hidden")
    const isOpen = !$filter.classList.contains("moj-hidden")
    $button.textContent = isOpen ? "Hide filter" : "Show filter"
    $button.setAttribute("aria-expanded", isOpen.toString())
  }
}

const CourtCaseFilterWrapper: React.FC<Props> = ({ filter, appliedFilters, courtCaseList, pagination }: Props) => {
  return (
    <>
      <div className="moj-filter-layout">
        <div className="moj-filter-layout__filter">{filter}</div>

        <div className="moj-filter-layout__content">
          <div className="moj-action-bar">
            <button
              data-module="govuk-button"
              id="filter-button"
              className="govuk-button govuk-button--secondary govuk-!-margin-bottom-0"
              type="button"
              aria-haspopup="true"
              aria-expanded="false"
              onClick={() => toggleFilter()}
            >
              {"Show filter"}
            </button>
            {appliedFilters}
          </div>

          <div className="moj-scrollable-pane">
            <div className="moj-scrollable-pane__wrapper">
              {courtCaseList}
              {pagination}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourtCaseFilterWrapper

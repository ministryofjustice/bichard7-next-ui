/* eslint-disable @typescript-eslint/no-non-null-assertion */
import FilterChip from "components/FilterChip"
import ConditionalRender from "components/ConditionalRender"
import { Dispatch } from "react"
import { Filter, FilterAction, FilterState } from "types/CourtCaseFilter"
import { anyFilterChips } from "utils/filterChips"
import FilterChipRow from "./FilterChipRow"
import { formatStringDateAsDisplayedDate } from "utils/formattedDate"
import { Link } from "govuk-react"
import { createUseStyles } from "react-jss"
import FilterChipContainer from "./FilterChipContainer"

interface Props {
  state: Filter
  dispatch: Dispatch<FilterAction>
  sectionState: FilterState
  marginTop: boolean
  placeholderMessage?: string
}

const useStyles = createUseStyles({
  headerRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    "& div:nth-child(1)": {
      flex: 1
    }
  }
})

const FilterChipSection: React.FC<Props> = ({
  state,
  dispatch,
  sectionState,
  marginTop,
  placeholderMessage
}: Props) => {
  const classes = useStyles()
  const dateRangeLabel = `${formatStringDateAsDisplayedDate(state.dateFrom.value)} - ${formatStringDateAsDisplayedDate(
    state.dateTo.value
  )}`
  return (
    <>
      <ConditionalRender isRendered={anyFilterChips(state, sectionState)}>
        <div className={classes.headerRow}>
          <div>
            <h2
              className={"govuk-heading-m govuk-!-margin-bottom-0" + (marginTop ? " govuk-!-margin-top-2" : "")}
            >{`${sectionState} filters`}</h2>
          </div>
          <div>
            <Link id="clear-filters" href="/bichard?keywords=">
              {"Clear filters"}
            </Link>
          </div>
        </div>

        <FilterChipRow
          chipLabel={state.defendantNameSearch.label!}
          condition={
            state.defendantNameSearch.value !== undefined &&
            state.defendantNameSearch.label !== undefined &&
            state.defendantNameSearch.state === sectionState
          }
          dispatch={dispatch}
          type="defendantName"
          label="Defendant name"
          state={state.defendantNameSearch.state || sectionState}
          value={state.defendantNameSearch.value!}
        />

        <FilterChipRow
          chipLabel={state.ptiurnSearch.label!}
          condition={
            state.ptiurnSearch.value !== undefined &&
            state.ptiurnSearch.label !== undefined &&
            state.ptiurnSearch.state === sectionState
          }
          dispatch={dispatch}
          type="ptiurn"
          label="PTIURN"
          state={state.ptiurnSearch.state || sectionState}
          value={state.ptiurnSearch.value!}
        />

        <FilterChipRow
          chipLabel={state.courtNameSearch.label!}
          condition={
            state.courtNameSearch.value !== undefined &&
            state.courtNameSearch.label !== undefined &&
            state.courtNameSearch.state === sectionState
          }
          dispatch={dispatch}
          type="courtName"
          label="Court name"
          state={state.courtNameSearch.state || sectionState}
          value={state.courtNameSearch.value!}
        />

        <FilterChipContainer label="Reason codes" condition={state.reasonCodes.length > 0}>
          {state.reasonCodes.map((reasonCode) => (
            <FilterChip
              key={`filter-chip${reasonCode.value}`}
              chipLabel={reasonCode.label!}
              dispatch={dispatch}
              removeAction={() => {
                return { method: "remove", type: "reasonCodes", value: reasonCode.value } as FilterAction
              }}
              state={reasonCode.state || sectionState}
            />
          ))}
        </FilterChipContainer>

        <ConditionalRender
          isRendered={state.reasonFilter.filter((reasonFilter) => reasonFilter.state === sectionState).length > 0}
        >
          <h3 className="govuk-heading-s govuk-!-margin-bottom-0">{"Reason"}</h3>
          <ul className="moj-filter-tags govuk-!-margin-bottom-0">
            {state.reasonFilter
              .filter((reasonFilter) => reasonFilter.state === sectionState)
              .map((reasonFilter) => (
                <FilterChip
                  key={reasonFilter.value}
                  chipLabel={reasonFilter.value}
                  dispatch={dispatch}
                  removeAction={() => {
                    return { method: "remove", type: "reason", value: reasonFilter.value }
                  }}
                  state={reasonFilter.state}
                />
              ))}
          </ul>
        </ConditionalRender>

        <FilterChipRow
          chipLabel={state.urgentFilter.label!}
          condition={
            state.urgentFilter.value !== undefined &&
            state.urgentFilter.label !== undefined &&
            state.urgentFilter.state === sectionState
          }
          dispatch={dispatch}
          type="urgency"
          label="Urgency"
          state={state.urgentFilter.state || sectionState}
          value={state.urgentFilter.value!}
        />

        <FilterChipRow
          chipLabel={dateRangeLabel}
          condition={
            state.dateFrom.value !== undefined &&
            state.dateTo.value !== undefined &&
            state.dateFrom.state === sectionState &&
            state.dateTo.state === sectionState
          }
          dispatch={dispatch}
          type="dateRange"
          label="Date range"
          state={state.dateFrom.state || sectionState}
          value={dateRangeLabel}
        />

        <ConditionalRender
          isRendered={state.caseAgeFilter.filter((caseAgeFilter) => caseAgeFilter.state === sectionState).length > 0}
        >
          <h3 className="govuk-heading-s govuk-!-margin-bottom-0">{"Case age (SLA)"}</h3>
          <ul className="moj-filter-tags govuk-!-margin-bottom-0">
            {state.caseAgeFilter
              .filter((caseAgeFilter) => caseAgeFilter.state === sectionState)
              .map((caseAgeFilter) => (
                <FilterChip
                  key={caseAgeFilter.value}
                  chipLabel={caseAgeFilter.value}
                  dispatch={dispatch}
                  removeAction={() => {
                    return { method: "remove", type: "caseAge", value: caseAgeFilter.value }
                  }}
                  state={caseAgeFilter.state}
                />
              ))}
          </ul>
        </ConditionalRender>

        <FilterChipRow
          chipLabel={state.caseStateFilter.label!}
          condition={
            state.caseStateFilter.value !== undefined &&
            state.caseStateFilter.label !== undefined &&
            state.caseStateFilter.state === sectionState
          }
          dispatch={dispatch}
          type="caseState"
          label="Case state"
          state={state.caseStateFilter.state || sectionState}
          value={state.caseStateFilter.value!}
        />

        <FilterChipRow
          chipLabel={state.lockedFilter.label!}
          condition={
            state.lockedFilter.value !== undefined &&
            state.lockedFilter.label !== undefined &&
            state.lockedFilter.state === sectionState
          }
          dispatch={dispatch}
          type="locked"
          label="Locked state"
          state={state.lockedFilter.state || sectionState}
          value={state.lockedFilter.value!}
        />

        <FilterChipRow
          chipLabel={state.myCasesFilter.label!}
          condition={
            state.myCasesFilter.value !== undefined &&
            state.myCasesFilter.label !== undefined &&
            state.myCasesFilter.state === sectionState
          }
          dispatch={dispatch}
          type="myCases"
          label="My cases"
          state={state.myCasesFilter.state || sectionState}
          value={state.myCasesFilter.value!}
        />
      </ConditionalRender>
      <ConditionalRender isRendered={!anyFilterChips(state, sectionState) && placeholderMessage !== undefined}>
        <h2
          className={"govuk-heading-m govuk-!-margin-bottom-0" + (marginTop ? " govuk-!-margin-top-2" : "")}
        >{`${sectionState} filters`}</h2>
        <p>{placeholderMessage}</p>
      </ConditionalRender>
    </>
  )
}

export default FilterChipSection

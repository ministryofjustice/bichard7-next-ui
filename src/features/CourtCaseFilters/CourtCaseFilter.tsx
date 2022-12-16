/* eslint-disable @typescript-eslint/no-non-null-assertion */
import CourtCaseTypeOptions from "components/CourtDateFilter/CourtCaseTypeOptions"
import UrgencyFilterOptions from "components/CourtDateFilter/UrgencyFilterOptions"
import FilterChip from "components/FilterChip"
import If from "components/If"
import LockedFilterOptions from "components/LockedFilter/LockedFilterOptions"
import { HintText } from "govuk-react"
import { useReducer } from "react"
import { Reason } from "types/CaseListQueryParams"
import type { FilterAction, FilterState } from "types/CourtCaseFilter"
import CourtDateFilterOptions from "../../components/CourtDateFilter/CourtDateFilterOptions"

interface Props {
  courtCaseTypes?: Reason[]
  dateRange?: string | null
  urgency?: string | null
  locked?: string | null
}

const reducer = (state: FilterState, action: FilterAction) => {
  console.log("reducer action dispatched", state, action)
  if (action.method === "add") {
    if (action.type === "urgency") {
      state.urgentFilter.value = action.value
      state.urgentFilter.label = action.value ? "Urgent" : "Non-urgent"
    } else if (action.type === "date") {
      state.dateFilter.value = action.value
    } else if (action.type === "locked") {
      state.lockedFilter.value = action.value
    } else if (action.type === "reason") {
      state.reasonFilter.value.push(action.value)
    }
  } else if (action.method === "remove") {
    if (action.type === "urgency") {
      state.urgentFilter.value = undefined
    } else if (action.type === "date") {
      state.dateFilter.value = undefined
    } else if (action.type === "locked") {
      state.lockedFilter.value = undefined
    } else if (action.type === "reason") {
      state.reasonFilter.value = state.reasonFilter.value.filter((reason: string) => reason === action.value)
    }
  }
  return state
}

const CourtCaseFilter: React.FC<Props> = ({ courtCaseTypes, dateRange, urgency, locked }: Props) => {
  // const urgentFilterState = {
  //   filter: useState<boolean | undefined>(undefined),
  //   label: useState<string>("")
  // }
  // const dateFilterState = {
  //   filter: useState<string | undefined>(undefined),
  //   label: useState<string>("")
  // }
  // const lockedFilterState = {
  //   filter: useState<boolean | undefined>(undefined),
  //   label: useState<string>("")
  // }
  // const reasonFilterState = {
  //   filter: useState<string[]>([]),
  //   label: useState<string>("")
  // }

  const [state, dispatch] = useReducer(reducer, {
    urgentFilter: {},
    dateFilter: {},
    lockedFilter: {},
    reasonFilter: { value: [] }
  })

  return (
    <form method={"get"}>
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
              <h2 className="govuk-heading-m govuk-!-margin-bottom-0">{"Selected filters"}</h2>
              <ul className="moj-filter-tags">
                <li>
                  <>
                    {console.log("Rendering urgent filter chip, state: ", state)}
                    <If condition={state.urgentFilter.value !== undefined && state.urgentFilter.label !== undefined}>
                      <FilterChip
                        chipLabel={state.urgentFilter.label!}
                        dispatch={dispatch}
                        removeAction={() => {
                          return { method: "remove", type: "urgency", value: state.urgentFilter.value! }
                        }}
                      />
                    </If>
                  </>
                  {/* <FilterChip
                    tag={state.dateFilter !== undefined ? "moj-filter__tag" : "moj-filter moj-hidden"}
                    chipLabel={state.dateFilter.label}
                    paramName="dateRange"
                    onClick={(option: string) => dispatch({ method: "add", type: "date", value: option })}
                  />
                  <FilterChip
                    tag={state.lockedFilter !== undefined ? "moj-filter__tag" : "moj-filter moj-hidden"}
                    chipLabel={state.lockedFilter.label}
                    paramName="locked"
                    onClick={() => dispatch({ method: "add", type: "locked", value: true })}
                  />
                  {state.reasonFilter.value.map((reason: Reason) => (
                    <FilterChip
                      key={reason}
                      tag="moj-filter__tag"
                      chipLabel={reason}
                      paramName="type"
                      onClick={() => dispatch({ method: "add", type: "reason", value: reason })}
                    />
                  ))} */}
                </li>
              </ul>
            </div>
          </div>
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
          {/* <div className="govuk-form-group">
            <CourtCaseTypeOptions
              courtCaseTypes={courtCaseTypes}
              onClick={(option: string) => {
                reasonFilterState.filter[1]([...reasonFilterState.filter[0], option])
                reasonFilterState.label[1](option)
              }}
            />
          </div>
          <div className="govuk-form-group">
            <CourtDateFilterOptions
              dateRange={dateRange}
              onClick={(option: string) => {
                dateFilterState.filter[1](option)
                dateFilterState.label[1](option)
              }}
            />
          </div> */}
          <div>
            <UrgencyFilterOptions urgency={urgency} dispatch={dispatch} />
          </div>
          {/* <div>
            <LockedFilterOptions
              locked={locked}
              onClick={(option: string) => {
                const filterValue = option === "Locked" ? true : option === "Unlocked" ? false : undefined
                lockedFilterState.filter[1](filterValue)
                lockedFilterState.label[1](option)
              }}
            />
          </div> */}
        </div>
      </div>
    </form>
  )
}

export default CourtCaseFilter

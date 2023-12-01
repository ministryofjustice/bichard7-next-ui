import OrganisationUnits from "@moj-bichard7-developers/bichard7-next-data/data/organisation-unit.json"
import { OrganisationUnit } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import { useCombobox } from "downshift"
import { Input } from "govuk-react"
import { sortBy } from "lodash"
import { useState } from "react"
import styled from "styled-components"
import { AmendmentKeys, IndividualAmendmentValues, UpdatedOffenceResult } from "../types/Amendments"

const FilteredOrganisationUnits: OrganisationUnit[] = OrganisationUnits.filter(
  (organisationUnit) => organisationUnit.topLevelName !== "Police Service" && /\S/.test(organisationUnit.thirdLevelName)
)
const FilteredAndSortedOrganisationUnits = sortBy(
  FilteredOrganisationUnits,
  (organisationUnit) => organisationUnit.thirdLevelName
)

const getFullOrganisationCode = (organisationUnit: OrganisationUnit) =>
  `${organisationUnit.topLevelCode}${organisationUnit.secondLevelCode}${organisationUnit.thirdLevelCode}${organisationUnit.bottomLevelCode}`

const getFullOrganisationName = (organisationUnit: OrganisationUnit) =>
  [
    organisationUnit.topLevelName,
    organisationUnit.secondLevelName,
    organisationUnit.thirdLevelName,
    organisationUnit.bottomLevelName
  ]
    .filter((part) => !!part)
    .join("-")

const ListWrapper = styled.div`
  li {
    list-style: none;
    padding: 10px;
    border: 1px gray solid;
    position: relative;
    left: -40px;
  }

  span {
    padding-top: 0px;
    display: block;
    font-size: medium;
  }
`

interface Props {
  amendFn: (keyToAmend: AmendmentKeys) => (newValue: IndividualAmendmentValues) => void
  resultIndex: number
  offenceIndex: number
  value?: string
}

const OrganisationUnitTypeahead: React.FC<Props> = ({ value, amendFn, resultIndex, offenceIndex }: Props) => {
  const items = FilteredAndSortedOrganisationUnits
  const [inputItems, setInputItems] = useState(items)

  const { isOpen, getMenuProps, getInputProps, highlightedIndex, getItemProps } = useCombobox({
    items: inputItems,
    onInputValueChange: ({ inputValue }) => {
      const filteredInputItems: OrganisationUnit[] = items.filter((organisationUnit) =>
        getFullOrganisationCode(organisationUnit)
          .toLowerCase()
          .startsWith((inputValue || "").toLowerCase())
      )
      setInputItems(filteredInputItems)
      amendFn("nextSourceOrganisation")({
        resultIndex: resultIndex,
        offenceIndex: offenceIndex,
        updatedValue: inputValue
      } as UpdatedOffenceResult)
    },
    itemToString(item) {
      return item ? getFullOrganisationCode(item) : ""
    }
  })
  return (
    <div>
      <Input
        {...getInputProps({
          className: "govuk-input govuk-input--width-20",
          id: "next-hearing-location",
          name: "next-hearing-location",
          value: value
        })}
      />
      <ListWrapper>
        <ul {...getMenuProps()}>
          {isOpen &&
            inputItems.map((item, index) => (
              <li
                style={highlightedIndex === index ? { backgroundColor: "#bde4ff" } : {}}
                key={`${item}${index}`}
                {...getItemProps({ item, index })}
              >
                {getFullOrganisationCode(item)}
                <span>{getFullOrganisationName(item)}</span>
              </li>
            ))}
        </ul>
      </ListWrapper>
    </div>
  )
}

export default OrganisationUnitTypeahead

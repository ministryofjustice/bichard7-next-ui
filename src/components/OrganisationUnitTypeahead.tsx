import OrganisationUnits from "@moj-bichard7-developers/bichard7-next-data/data/organisation-unit.json"
import { OrganisationUnit } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import { useCombobox } from "downshift"
import { Button, Input, Label } from "govuk-react"
import { sortBy } from "lodash"
import { useState } from "react"
import styled from "styled-components"

const FilteredOrganisationUnits: OrganisationUnit[] = OrganisationUnits.filter(
  (organisationUnit) => organisationUnit.topLevelName !== "Police Service" && /\S/.test(organisationUnit.thirdLevelName)
)
const FilteredAndSortedOrganisationUnits = sortBy(
  FilteredOrganisationUnits,
  (organisationUnit) => organisationUnit.thirdLevelName
)

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const OrganisationUnitTypeahead: React.FC = () => {
  const items = FilteredAndSortedOrganisationUnits
  const [inputItems, setInputItems] = useState(items)

  const {
    isOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    getToggleButtonProps,
    selectItem
  } = useCombobox({
    items: inputItems,
    onInputValueChange: ({ inputValue }) => {
      const filteredInputItems: OrganisationUnit[] = items.filter(
        (organisationUnit) =>
          organisationUnit.thirdLevelName?.toLowerCase().startsWith((inputValue || "").toLowerCase())
      )
      setInputItems(filteredInputItems)
    },
    itemToString(item) {
      return item ? item.thirdLevelName || "Unknown" : ""
    }
  })
  return (
    <div>
      <Wrapper>
        <Label {...getLabelProps()}>{"Choose an element:"}</Label>
        <div>
          <Input {...getInputProps({})} />
          <Button
            tabIndex={-1}
            onClick={() => {
              selectItem(null)
            }}
            aria-label="clear selection"
          >
            &#215;
          </Button>
          <Button aria-label="toggle menu" className="px-2" type="button" {...getToggleButtonProps()}>
            {isOpen ? <>&#8593;</> : <>&#8595;</>}
          </Button>
        </div>
        <ListWrapper>
          <ul {...getMenuProps()}>
            {isOpen &&
              inputItems.map((item, index) => (
                <li
                  style={highlightedIndex === index ? { backgroundColor: "#bde4ff" } : {}}
                  key={`${item}${index}`}
                  {...getItemProps({ item, index })}
                >
                  {item.thirdLevelName}
                </li>
              ))}
          </ul>
        </ListWrapper>
      </Wrapper>
    </div>
  )
}

export default OrganisationUnitTypeahead

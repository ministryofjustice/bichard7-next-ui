import axios from "axios"
import { useCombobox } from "downshift"
import { Input } from "govuk-react"
import { useCallback, useEffect, useState } from "react"
import styled from "styled-components"
import { AmendmentKeys, IndividualAmendmentValues, UpdatedOffenceResult } from "../types/Amendments"
import OrganisationUnitApiResponse from "../types/OrganisationUnitApiResponse"
import { isError } from "../types/Result"

const ListWrapper = styled.div`
  max-height: 20rem;
  overflow-y: scroll;
  background: white;
  width: 100%;

  ul {
    margin-top: 0;
    padding-left: 0;
  }

  li {
    list-style: none;
    padding: 10px;
    border: 1px gray solid;
    position: relative;
  }

  span {
    padding-top: 0px;
    display: block;
    font-size: 1em;
  }
`

interface Props {
  amendFn: (keyToAmend: AmendmentKeys) => (newValue: IndividualAmendmentValues) => void
  resultIndex: number
  offenceIndex: number
  value?: string
}

const OrganisationUnitTypeahead: React.FC<Props> = ({ value, amendFn, resultIndex, offenceIndex }: Props) => {
  const [inputItems, setInputItems] = useState<OrganisationUnitApiResponse>([])

  const fetchItems = useCallback(async (searchStringParam?: string) => {
    const organisationUnitsResponse = await axios
      .get<OrganisationUnitApiResponse>("/bichard/api/organisation-units", {
        params: {
          search: searchStringParam
        }
      })
      .then((response) => response.data)
      .catch((error) => error as Error)

    if (isError(organisationUnitsResponse)) {
      return
    }

    setInputItems(organisationUnitsResponse)
  }, [])

  const { isOpen, getMenuProps, getInputProps, highlightedIndex, getItemProps, inputValue } = useCombobox({
    items: inputItems,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    onInputValueChange: ({ inputValue }) => {
      amendFn("nextSourceOrganisation")({
        resultIndex: resultIndex,
        offenceIndex: offenceIndex,
        updatedValue: inputValue
      } as UpdatedOffenceResult)
    },
    initialInputValue: value,
    itemToString: (item) => item?.fullOrganisationCode ?? ""
  })

  useEffect(() => {
    fetchItems(inputValue)
  }, [fetchItems, inputValue])

  return (
    <div>
      <Input
        {...getInputProps({
          className: "govuk-input",
          id: "next-hearing-location",
          name: "next-hearing-location",
          value
        })}
      />

      <ListWrapper>
        <ul {...getMenuProps()}>
          {isOpen
            ? inputItems.map((item, index) => (
                <li
                  style={highlightedIndex === index ? { backgroundColor: "#bde4ff" } : {}}
                  key={`${item}${index}`}
                  {...getItemProps({ item, index })}
                >
                  {item.fullOrganisationCode}
                  <span>{item.fullOrganisationName}</span>
                </li>
              ))
            : null}
        </ul>
      </ListWrapper>
    </div>
  )
}

export default OrganisationUnitTypeahead

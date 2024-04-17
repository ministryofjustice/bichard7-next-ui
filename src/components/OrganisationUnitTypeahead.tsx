import axios from "axios"
import { useCourtCase } from "context/CourtCaseContext"
import { useCombobox } from "downshift"
import { Input } from "govuk-react"
import { useCallback, useEffect, useState } from "react"
import OrganisationUnitApiResponse from "../types/OrganisationUnitApiResponse"
import { isError } from "../types/Result"
import { ListWrapper } from "./OrganisationUnitTypeahead.styles"

interface Props {
  resultIndex: number
  offenceIndex: number
  value?: string
}

const OrganisationUnitTypeahead: React.FC<Props> = ({ value, resultIndex, offenceIndex }: Props) => {
  const { amend } = useCourtCase()
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
      amend("nextSourceOrganisation")({
        resultIndex: resultIndex,
        offenceIndex: offenceIndex,
        value: inputValue
      })
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

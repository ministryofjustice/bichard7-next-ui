import { useEffect, useState, type Dispatch } from "react"
import type { FilterAction, FilterState } from "types/CourtCaseFilter"
import TextFilter from "./TextFilter"

interface Props {
  value: {
    value?: string
    state?: FilterState
    label?: string
  }[]
  dispatch: Dispatch<FilterAction>
}

const tokenise = (input: string): string[] => input.split(" ").filter((x) => x)

const ReasonCodeFilter: React.FC<Props> = ({ value, dispatch }: Props) => {
  const [rawValue, setRawValue] = useState<string>("")
  const inputValue = value.map((reasonCode) => reasonCode.value).join(" ")

  const hasChanged = (newValue: string): boolean => tokenise(rawValue).join(" ") !== newValue

  useEffect(() => setRawValue(inputValue), [inputValue])

  const handleChange: Dispatch<FilterAction> = (newValue) => {
    if (newValue.type !== "reasonCodes") {
      return
    }

    const unsplitValue = Array.isArray(newValue.value) ? newValue.value.join(" ") : newValue.value
    setRawValue(unsplitValue)

    if (hasChanged(unsplitValue)) {
      const splitValue = Array.isArray(newValue.value) ? newValue.value : tokenise(newValue.value)
      dispatch({ ...newValue, type: "reasonCodes", value: splitValue })
    }
  }

  return <TextFilter label={"Reason codes"} id="reasonCodes" dispatch={handleChange} value={rawValue} />
}

export default ReasonCodeFilter

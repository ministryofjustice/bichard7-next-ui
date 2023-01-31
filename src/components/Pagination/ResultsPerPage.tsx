import { SelectInput } from "@govuk-react/select"
import { useRouter } from "next/router"

interface Props {
  options: number[]
  selected: number
}

const ResultsPerPage: React.FC<Props> = ({ options, selected }: Props) => {
  const router = useRouter()

  return (
    <div className="results-per-page">
      {"View "}
      <SelectInput
        onChange={(event) => {
          const target = event.target.value
          router.push({ query: { maxPageItems: target } })
        }}
        value={selected}
        id="results-per-page"
      >
        {options.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </SelectInput>
      {" cases per page"}
    </div>
  )
}

export default ResultsPerPage

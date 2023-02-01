import { SelectInput } from "@govuk-react/select"
import { useRouter } from "next/router"
import { createUseStyles } from "react-jss"

interface Props {
  options: number[]
  selected: number
}

const useStyles = createUseStyles({
  "cases-per-page-picker": {
    width: "auto"
  }
})

const CasesPerPage: React.FC<Props> = ({ options, selected }: Props) => {
  const router = useRouter()
  const classes = useStyles()

  return (
    <div className="moj-pagination__results">
      {"View "}
      <SelectInput
        onChange={(event) => {
          const target = event.target.value
          router.push({ query: { maxPageItems: target } })
        }}
        value={selected}
        className={`cases-per-page ${classes["cases-per-page-picker"]}`}
        aria-label="Cases per page"
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

export default CasesPerPage

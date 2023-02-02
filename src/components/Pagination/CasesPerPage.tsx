import { SelectInput } from "@govuk-react/select"
import { useRouter } from "next/router"
import { createUseStyles } from "react-jss"

interface Props {
  options: number[]
  selected: number
  pageNum: number
  casesPerPage: number
}

const useStyles = createUseStyles({
  "cases-per-page-picker": {
    width: "auto"
  }
})

const CasesPerPage: React.FC<Props> = ({ options, selected, pageNum, casesPerPage }: Props) => {
  const router = useRouter()
  const classes = useStyles()

  return (
    <div className="moj-pagination__results">
      {"View "}
      <SelectInput
        onChange={(event) => {
          const newCasesPerPage = event.target.value

          const firstCaseIndex = (pageNum - 1) * casesPerPage + 1
          const newPageNum = Math.floor(firstCaseIndex / parseInt(newCasesPerPage, 10)) + 1

          router.push({ query: { ...router.query, maxPageItems: newCasesPerPage, page: newPageNum } })
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

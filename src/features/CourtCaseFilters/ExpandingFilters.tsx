/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import Hide from "components/Hide"
import If from "components/If"
import { ReactNode, useState } from "react"
import { createUseStyles } from "react-jss"

const useStyles = createUseStyles({
  legendColour: {
    color: "#1D70B8"
  },
  legendContainer: {
    marginTop: "8px"
  },
  iconButton: {
    border: "3px solid transparent",
    backgroundColor: "transparent",
    "&:active": {
      backgroundColor: "#b0b4b6"
    }
  },
  container: {
    marginLeft: "-10px",
    width: "fit-content",
    paddingRight: "10px",
    display: "flex",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "#b0b4b6"
    },
    "&:active": {
      backgroundColor: "#b0b4b6"
    }
  }
})

const UpArrow: React.FC = () => (
  <svg width={18} height={10} viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.999926 9.28432L8.74976 1.56866L16.4996 9.28432" stroke="#0B0C0C" strokeWidth={2} />
  </svg>
)

const DownArrow: React.FC = () => (
  <svg width={18} height={11} viewBox="0 0 18 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.9994 1.26702L9.26685 9L1.49977 1.30171" stroke="#0B0C0C" strokeWidth={2} />
  </svg>
)

interface Props {
  filterName: string
  children: ReactNode
  hideChildren?: boolean
}

const ExpandingFilters: React.FC<Props> = ({ filterName, children, hideChildren }: Props) => {
  const [caseTypeIsVisible, setCaseTypeVisible] = useState(true)
  const classes = useStyles()
  return (
    <fieldset className="govuk-fieldset">
      <div
        className={classes.container}
        onClick={() => {
          setCaseTypeVisible(!caseTypeIsVisible)
        }}
      >
        <button type="button" className={classes.iconButton} aria-label={`${filterName} filter options`}>
          {caseTypeIsVisible ? <UpArrow /> : <DownArrow />}
        </button>
        <div className={classes.legendContainer}>
          <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
            <div className={classes.legendColour}>{filterName}</div>
          </legend>
        </div>
      </div>
      {hideChildren ? (
        <Hide isVisible={caseTypeIsVisible}>{children}</Hide>
      ) : (
        <If isRendered={caseTypeIsVisible}>{children}</If>
      )}
    </fieldset>
  )
}

export default ExpandingFilters

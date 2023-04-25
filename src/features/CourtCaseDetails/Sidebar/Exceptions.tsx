import { GridCol, GridRow } from "govuk-react"
import { createUseStyles } from "react-jss"
import getExceptionInfo from "utils/getExceptionInfo"
import ActionLink from "components/ActionLink"
import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/build/src/types/AnnotatedHearingOutcome"

interface Props {
  aho: AnnotatedHearingOutcome
}

const useStyles = createUseStyles({
  exceptionRow: {
    "& .exception-details-column": {
      "& .exception-field": {
        display: "block",
        fontSize: "19px",
        fontWeight: "bold"
      },
      "& .exception-details": {
        fontSize: "16px"
      }
    }
  }
})

const getExceptionTitle = (path: (string | number)[]) => {
  const offenceIndex = path.findIndex((p) => p === "Offence")
  let location: string | undefined
  if (offenceIndex > 0) {
    const offenceOrderIndex = Number(path[offenceIndex + 1]) + 1
    location = `Offence ${offenceOrderIndex}`
  } else if (path.includes("Case")) {
    location = "Case information"
  } else if (path.includes("Hearing")) {
    location = "Hearing"
  }

  const fieldName = String(path[path.length - 1])
  const fieldNameWords = fieldName.match(/([A-Z]+[a-z]+)/g)
  const formattedFieldName = fieldNameWords
    ? fieldNameWords[0] + fieldNameWords.join(" ").slice(fieldNameWords[0].length).toLowerCase()
    : fieldName

  if (location) {
    location = ` (${location})`
  }

  return `${formattedFieldName}${location}`
}

const Exceptions = ({ aho }: Props) => {
  const classes = useStyles()

  return (
    <>
      {aho.Exceptions.length === 0 && "There are no exceptions for this case."}
      {aho.Exceptions.map(({ code, path }, index) => {
        const exceptionInfo = getExceptionInfo(code)

        return (
          <GridRow key={`exception_${index}`} className={`${classes.exceptionRow} moj-exception-row`}>
            <GridCol className="exception-details-column">
              <ActionLink className="exception-field">{getExceptionTitle(path)}</ActionLink>
              <p className="exception-details">
                {code}
                {exceptionInfo?.title && ` - ${exceptionInfo.title}`}
              </p>
            </GridCol>
          </GridRow>
        )
      })}
    </>
  )
}

export default Exceptions

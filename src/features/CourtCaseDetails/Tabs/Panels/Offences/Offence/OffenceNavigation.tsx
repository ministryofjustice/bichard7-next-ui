import SecondaryButton from "components/SecondaryButton"
import { GridCol, GridRow } from "govuk-react"
import { createUseStyles } from "react-jss"
import { BackToAllOffencesLink } from "./BackToAllOffencesLink"

interface OffenceNavigationProps {
  onBackToAllOffences: () => void
  selectedOffenceIndex: number
  onPreviousClick: () => void
  onNextClick: () => void
  offencesCount: number
}
const useStyles = createUseStyles({
  button: {
    textAlign: "right"
  },

  nextButton: {
    marginLeft: "30px"
  }
})

export const OffenceNavigation = ({
  onBackToAllOffences,
  selectedOffenceIndex,
  onPreviousClick,
  onNextClick,
  offencesCount
}: OffenceNavigationProps) => {
  const classes = useStyles()
  return (
    <GridRow>
      <GridCol>
        <BackToAllOffencesLink onClick={() => onBackToAllOffences()} />
      </GridCol>
      <GridCol className={classes.button}>
        {selectedOffenceIndex !== 1 && (
          <SecondaryButton onClick={() => onPreviousClick()}>{"Previous offence"}</SecondaryButton>
        )}
        {selectedOffenceIndex !== offencesCount && (
          <SecondaryButton className={classes.nextButton} onClick={() => onNextClick()}>
            {"Next offence"}
          </SecondaryButton>
        )}
      </GridCol>
    </GridRow>
  )
}

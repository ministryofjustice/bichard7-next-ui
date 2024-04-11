import { SecondaryButton } from "components/Buttons"
import { GridCol, GridRow } from "govuk-react"
import { BackToAllOffencesLink } from "./BackToAllOffencesLink"
import { PreviousButton, NextButton } from "./OffenceNavigation.styles"

interface OffenceNavigationProps {
  onBackToAllOffences: () => void
  selectedOffenceIndex: number
  onPreviousClick: () => void
  onNextClick: () => void
  offencesCount: number
}

export const OffenceNavigation = ({
  onBackToAllOffences,
  selectedOffenceIndex,
  onPreviousClick,
  onNextClick,
  offencesCount
}: OffenceNavigationProps) => {
  return (
    <GridRow>
      <GridCol>
        <BackToAllOffencesLink onClick={() => onBackToAllOffences()} />
      </GridCol>
      <GridCol>
        <PreviousButton>
          {selectedOffenceIndex !== 1 && (
            <SecondaryButton onClick={() => onPreviousClick()}>{"Previous offence"}</SecondaryButton>
          )}
          {selectedOffenceIndex !== offencesCount && (
            <NextButton>
              <SecondaryButton onClick={() => onNextClick()}>{"Next offence"}</SecondaryButton>
            </NextButton>
          )}
        </PreviousButton>
      </GridCol>
    </GridRow>
  )
}

import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import ConditionalRender from "components/ConditionalRender"
import LinkButton from "components/LinkButton"
import { createUseStyles } from "react-jss"
import type NavigationHandler from "types/NavigationHandler"
import { gdsLightGrey, textPrimary, gdsMidGrey } from "../../../utils/colours"
import DefaultException from "../../../components/Exception/DefaultException"
import PncException from "../../../components/Exception/PncException"
import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"

const isPncException = (code: ExceptionCode) =>
  [ExceptionCode.HO100302, ExceptionCode.HO100314, ExceptionCode.HO100402, ExceptionCode.HO100404].includes(code)

interface Props {
  aho: AnnotatedHearingOutcome
  onNavigate: NavigationHandler
  canResolveAndSubmit: boolean
}

const useStyles = createUseStyles({
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "0"
  }
})

const Exceptions = ({ aho, onNavigate, canResolveAndSubmit }: Props) => {
  const classes = useStyles()
  const pncExceptions = aho.Exceptions.filter(({ code }) => isPncException(code))
  const otherExceptions = aho.Exceptions.filter(({ code }) => !isPncException(code))

  return (
    <>
      {aho.Exceptions.length === 0 && "There are no exceptions for this case."}

      {pncExceptions.map(({ code }, index) => (
        <PncException key={`exception_${index}`} code={code} message={aho.PncErrorMessage} />
      ))}

      {otherExceptions.map(({ code, path }, index) => (
        <DefaultException key={`exception_${index}`} path={path} code={code} onNavigate={onNavigate} />
      ))}

      <ConditionalRender isRendered={canResolveAndSubmit && aho.Exceptions.length > 0}>
        <div className={`${classes.buttonContainer}`}>
          <LinkButton
            href="resolve"
            className="b7-manually-resolve-button"
            buttonColour={gdsLightGrey}
            buttonTextColour={textPrimary}
            buttonShadowColour={gdsMidGrey}
          >
            {"Mark as manually resolved"}
          </LinkButton>
        </div>
      </ConditionalRender>
    </>
  )
}

export default Exceptions

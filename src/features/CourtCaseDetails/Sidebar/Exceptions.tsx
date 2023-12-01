import { ExceptionCode } from "@moj-bichard7-developers/bichard7-next-core/core/types/ExceptionCode"
import ConditionalRender from "components/ConditionalRender"
import LinkButton from "components/LinkButton"
import { useCourtCase } from "context/CourtCaseContext"
import { useCsrfToken } from "context/CsrfTokenContext"
import { usePreviousPath } from "context/PreviousPathContext"
import { Button } from "govuk-react"
import { usePathname } from "next/navigation"
import { useRouter } from "next/router"
import { createUseStyles } from "react-jss"
import styled from "styled-components"
import type NavigationHandler from "types/NavigationHandler"
import DefaultException from "../../../components/Exception/DefaultException"
import PncException from "../../../components/Exception/PncException"
import Form from "../../../components/Form"
import { AmendmentRecords } from "../../../types/Amendments"
import { gdsLightGrey, gdsMidGrey, textPrimary } from "../../../utils/colours"

const isPncException = (code: ExceptionCode) =>
  [ExceptionCode.HO100302, ExceptionCode.HO100314, ExceptionCode.HO100402, ExceptionCode.HO100404].includes(code)

interface Props {
  onNavigate: NavigationHandler
  canResolveAndSubmit: boolean
  amendments: AmendmentRecords
}

const useStyles = createUseStyles({
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "0"
  }
})

const SeparatorLine = styled.div`
  position: relative;
  display: block;
  margin-bottom: 1.25rem;
  width: 100%;
  height: 2px;

  &:after {
    content: " ";
    position: absolute;
    height: 2px;
    width: calc(100% + (1.2625rem * 2));
    background: #b1b4b6;
    left: -1.2625rem;
  }
`

const Exceptions = ({ onNavigate, canResolveAndSubmit, amendments }: Props) => {
  const classes = useStyles()
  const courtCase = useCourtCase()
  const pncExceptions = courtCase.aho.Exceptions.filter(({ code }) => isPncException(code))
  const otherExceptions = courtCase.aho.Exceptions.filter(({ code }) => !isPncException(code))
  const csrfToken = useCsrfToken()
  const previousPath = usePreviousPath()

  const router = useRouter()

  let resolveLink = `${router.basePath}${usePathname()}/resolve`

  if (previousPath) {
    resolveLink += `?previousPath=${encodeURIComponent(previousPath)}`
  }

  const submitCasePath = `${router.basePath}${usePathname()}?${new URLSearchParams({
    resubmitCase: "true"
  })}`

  return (
    <>
      {courtCase.aho.Exceptions.length === 0 && "There are no exceptions for this case."}

      {pncExceptions.map(({ code }, index) => (
        <PncException key={`exception_${index}`} code={code} message={courtCase.aho.PncErrorMessage} />
      ))}

      {pncExceptions.length > 0 && otherExceptions.length > 0 && <SeparatorLine />}

      {otherExceptions.map(({ code, path }, index) => (
        <DefaultException key={`exception_${index}`} path={path} code={code} onNavigate={onNavigate} />
      ))}

      <ConditionalRender isRendered={canResolveAndSubmit && courtCase.aho.Exceptions.length > 0}>
        <div className={classes.buttonContainer}>
          <Form method="post" action={submitCasePath} csrfToken={csrfToken}>
            <input type="hidden" name="amendments" value={JSON.stringify(amendments)} />
            <Button id="submit" type="submit">
              {"Submit exception(s)"}
            </Button>
          </Form>
        </div>
        <div className={classes.buttonContainer}>
          <LinkButton
            href={resolveLink}
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

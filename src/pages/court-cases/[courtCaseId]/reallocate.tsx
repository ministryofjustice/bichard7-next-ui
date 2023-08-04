import Layout from "components/Layout"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import { ParsedUrlQuery } from "querystring"
import CourtCase from "services/entities/CourtCase"
import User from "services/entities/User"
import getDataSource from "services/getDataSource"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { Button, Fieldset, FormGroup, Heading, HintText, Label, Link, Select, TextArea } from "govuk-react"
import { useRouter } from "next/router"
import parseFormData from "utils/parseFormData"
import { isPost } from "utils/http"
import getCourtCaseByOrganisationUnit from "services/getCourtCaseByOrganisationUnit"
import { isError } from "types/Result"
import ConditionalRender from "components/ConditionalRender"
import reallocateCourtCase from "services/reallocateCourtCase"
import redirectTo from "utils/redirectTo"
import { forces } from "@moj-bichard7-developers/bichard7-next-data"
import ButtonsGroup from "components/ButtonsGroup"
import { FormEventHandler, useState } from "react"
import { useCustomStyles } from "../../../../styles/customStyles"
import getForcesForReallocation from "services/getForcesForReallocation"
import { MAX_NOTE_LENGTH } from "config"
import forbidden from "utils/forbidden"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query, req, res } = context as AuthenticationServerSidePropsContext
    const { courtCaseId } = query as { courtCaseId: string }

    const dataSource = await getDataSource()
    const courtCase = await getCourtCaseByOrganisationUnit(dataSource, +courtCaseId, currentUser)

    if (!courtCase) {
      return {
        notFound: true
      }
    }

    if (isError(courtCase)) {
      console.error(courtCase)
      throw courtCase
    }

    if (!courtCase.canReallocate(currentUser.username)) {
      return forbidden(res)
    }

    const props = {
      user: currentUser.serialize(),
      courtCase: courtCase.serialize(),
      lockedByAnotherUser: courtCase.isLockedByAnotherUser(currentUser.username)
    }

    if (isPost(req)) {
      const { force, note } = (await parseFormData(req)) as { force: string; note?: string }
      const reallocateResult = await reallocateCourtCase(dataSource, courtCase.errorId, currentUser, force, note)

      if (isError(reallocateResult)) {
        throw reallocateResult
      } else {
        return redirectTo("/")
      }
    }

    return { props }
  }
)

interface Props {
  user: User
  courtCase: CourtCase
  lockedByAnotherUser: boolean
  noteTextError?: string
}

const CourtCaseDetailsPage: NextPage<Props> = ({ courtCase, user, lockedByAnotherUser }: Props) => {
  const [noteRemainingLength, setNoteRemainingLength] = useState(MAX_NOTE_LENGTH)
  const classes = useCustomStyles()
  const { basePath } = useRouter()
  const currentForce = forces.find((force) => force.code === courtCase.orgForPoliceFilter?.substring(0, 2))
  const forcesForReallocation = getForcesForReallocation(currentForce?.code)
  const handleOnNoteChange: FormEventHandler<HTMLTextAreaElement> = (event) => {
    setNoteRemainingLength(MAX_NOTE_LENGTH - event.currentTarget.value.length)
  }

  return (
    <>
      <Layout user={user}>
        <Heading as="h1" size="LARGE" aria-label="Reallocate Case">
          <title>{"Case Reallocation | Bichard7"}</title>
          <meta name="description" content="Case Reallocation| Bichard7" />
        </Heading>
        <Heading as="h2" size="MEDIUM">
          {"Case reallocation"}
        </Heading>
        <ConditionalRender isRendered={lockedByAnotherUser}>{"Case is locked by another user."}</ConditionalRender>
        <ConditionalRender isRendered={!lockedByAnotherUser}>
          <form method="POST" action="#">
            <Fieldset>
              <FormGroup>
                <Label>{"Current force owner"}</Label>
                <span>{`${currentForce?.code} - ${currentForce?.name}`}</span>
              </FormGroup>
              <FormGroup>
                <Label>{"New force owner"}</Label>
                <Select input={{ name: "force" }} label={""}>
                  {forcesForReallocation.map(({ code, name }) => (
                    <option key={code} value={code}>
                      {`${code} - ${name}`}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>{"Add a note (optional)"}</Label>
                <HintText className={classes["no-margin-bottom"]}>{"Input reason for case reallocation"}</HintText>
                <TextArea input={{ name: "note", rows: 5, maxLength: MAX_NOTE_LENGTH, onInput: handleOnNoteChange }}>
                  {}
                </TextArea>
                <HintText>{`You have ${noteRemainingLength} characters remaining`}</HintText>
              </FormGroup>

              <ButtonsGroup>
                <Button id="Reallocate" type="submit">
                  {"Reallocate"}
                </Button>
                <Link href={`${basePath}/court-cases/${courtCase.errorId}`}>{"Cancel"}</Link>
              </ButtonsGroup>
            </Fieldset>
          </form>
        </ConditionalRender>
      </Layout>
    </>
  )
}

export default CourtCaseDetailsPage

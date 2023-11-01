import { forces } from "@moj-bichard7-developers/bichard7-next-data"
import ButtonsGroup from "components/ButtonsGroup"
import ConditionalRender from "components/ConditionalRender"
import HeaderContainer from "components/Header/HeaderContainer"
import HeaderRow from "components/Header/HeaderRow"
import Layout from "components/Layout"
import { MAX_NOTE_LENGTH } from "config"
import { BackLink, Button, Fieldset, FormGroup, Heading, HintText, Label, Link, Select, TextArea } from "govuk-react"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { FormEventHandler, useState } from "react"
import { courtCaseToDisplayFullCourtCaseDto } from "services/dto/courtCaseDto"
import { userToDisplayFullUserDto } from "services/dto/userDto"
import getCourtCaseByOrganisationUnit from "services/getCourtCaseByOrganisationUnit"
import getDataSource from "services/getDataSource"
import getForcesForReallocation from "services/getForcesForReallocation"
import reallocateCourtCase from "services/reallocateCourtCase"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isError } from "types/Result"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import { DisplayFullUser } from "types/display/Users"
import forbidden from "utils/forbidden"
import { isPost } from "utils/http"
import redirectTo from "utils/redirectTo"
import { useCustomStyles } from "../../../../styles/customStyles"
import Form from "../../../components/Form"
import withCsrf from "../../../middleware/withCsrf/withCsrf"
import CsrfServerSidePropsContext from "../../../types/CsrfServerSidePropsContext"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, query, req, res, csrfToken, formData } = context as AuthenticationServerSidePropsContext &
      CsrfServerSidePropsContext
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

    if (courtCase.phase !== 1) {
      return redirectTo(`/court-cases/${courtCase.errorId}`)
    }

    const props = {
      csrfToken,
      user: userToDisplayFullUserDto(currentUser),
      courtCase: courtCaseToDisplayFullCourtCaseDto(courtCase),
      lockedByAnotherUser: courtCase.isLockedByAnotherUser(currentUser.username)
    }

    if (isPost(req)) {
      const { force, note } = formData as { force: string; note?: string }
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
  user: DisplayFullUser
  courtCase: DisplayFullCourtCase
  lockedByAnotherUser: boolean
  noteTextError?: string
  csrfToken: string
}

const CourtCaseDetailsPage: NextPage<Props> = ({ courtCase, user, lockedByAnotherUser, csrfToken }: Props) => {
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
      <Head>
        <title>{"Case Reallocation | Bichard7"}</title>
        <meta name="description" content="Case Reallocation | Bichard7" />
      </Head>
      <Layout user={user}>
        <BackLink href={`${basePath}/court-cases/${courtCase.errorId}`} onClick={function noRefCheck() {}}>
          {"Case Details"}
        </BackLink>
        <HeaderContainer id="header-container">
          <HeaderRow>
            <Heading as="h1" size="LARGE" aria-label="Reallocate Case">
              {"Case reallocation"}
            </Heading>
          </HeaderRow>
        </HeaderContainer>
        <ConditionalRender isRendered={lockedByAnotherUser}>{"Case is locked by another user."}</ConditionalRender>
        <ConditionalRender isRendered={!lockedByAnotherUser}>
          <Form method="POST" action="#" csrfToken={csrfToken}>
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
          </Form>
        </ConditionalRender>
      </Layout>
    </>
  )
}

export default CourtCaseDetailsPage

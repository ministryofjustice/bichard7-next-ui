import Layout from "components/Layout"
import { Heading } from "govuk-react"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next"
import { ParsedUrlQuery } from "querystring"
import User from "services/entities/User"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser } = context as AuthenticationServerSidePropsContext

    const props = {
      user: currentUser.serialize()
    }

    return { props }
  }
)

interface Props {
  user: User
}

const FeedbackPage: NextPage<Props> = ({ user }: Props) => {
  // const form = <form action={"/bichard/feedback"}></form>
  return (
    <>
      <Layout user={user}>
        <Heading as="h1" size="LARGE" aria-label="General Feedback">
          <title>{"General Feedback | Bichard7"}</title>
          <meta name="description" content="user feedback| Bichard7" />
        </Heading>
        <Heading as="h2" size="MEDIUM">
          {"Share your feedback"}
        </Heading>
      </Layout>
    </>
  )
}

export default FeedbackPage

import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from "next/document"
import React from "react"
import { ReactFragment } from "react"
import { ServerStyleSheet } from "styled-components"
import generateCsp from "utils/generateCsp"
import generateNonce from "utils/generateNonce"

const GovUkMetadata = () => {
  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <meta name="theme-color" content="#0b0c0c" />

      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

      <link rel="shortcut icon" sizes="16x16 32x32 48x48" href={`images/favicon.ico`} type="image/x-icon" />
      <link rel="mask-icon" href={`images/govuk-mask-icon.svg`} color="#0b0c0c" />
      <link rel="apple-touch-icon" sizes="180x180" href={`images/govuk-apple-touch-icon-180x180.png`} />
      <link rel="apple-touch-icon" sizes="167x167" href={`images/govuk-apple-touch-icon-167x167.png`} />
      <link rel="apple-touch-icon" sizes="152x152" href={`images/govuk-apple-touch-icon-152x152.png`} />
      <link rel="apple-touch-icon" href={`images/govuk-apple-touch-icon.png`} />

      <meta property="og:image" content={`images/govuk-opengraph-image.png`} />
    </>
  )
}

interface DocumentProps {
  nonce: string
  csp: string
}

class GovUkDocument extends Document<DocumentProps> {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const nonce = generateNonce()
    const csp = generateCsp(nonce)
    ctx.res?.setHeader("Content-Security-Policy", generateCsp(nonce))

    const initialProps = await Document.getInitialProps(ctx)
    const additionalProps = { nonce, csp }
    return {
      ...initialProps,
      ...additionalProps
    }
  }

  render() {
    const { nonce } = this.props
    return (
      <Html className="govuk-template" lang="en">
        <Head>
          <meta property="csp-nonce" content={nonce} />
          <GovUkMetadata />
        </Head>

        <body className="govuk-template__body">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default GovUkDocument

import crypto from "crypto"
import { addBasePath } from "next/dist/shared/lib/router/router"
import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from "next/document"
import React from "react"
import generateCSP from "utils/generateCsp"
import { ServerStyleSheet } from "styled-components"

const GovUkMetadata = () => (
  <>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#0b0c0c" />

    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

    <link rel="shortcut icon" sizes="16x16 32x32 48x48" href={addBasePath("/images/favicon.ico")} type="image/x-icon" />
    <link rel="mask-icon" href={addBasePath("/images/govuk-mask-icon.svg")} color="#0b0c0c" />
    <link rel="apple-touch-icon" sizes="180x180" href={addBasePath("/images/govuk-apple-touch-icon-180x180.png")} />
    <link rel="apple-touch-icon" sizes="167x167" href={addBasePath("/images/govuk-apple-touch-icon-167x167.png")} />
    <link rel="apple-touch-icon" sizes="152x152" href={addBasePath("/images/govuk-apple-touch-icon-152x152.png")} />
    <link rel="apple-touch-icon" href={addBasePath("/images/govuk-apple-touch-icon.png")} />

    <meta property="og:image" content={addBasePath("/images/govuk-opengraph-image.png")} />
  </>
)

const generateNonce = (): string => {
  return crypto.randomBytes(16).toString("base64")
}

interface DocumentProps {
  nonce: string
  styles: any
}

class GovUkDocument extends Document<DocumentProps> {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps & DocumentProps> {
    const initialProps = await Document.getInitialProps(ctx)

    const nonce = generateNonce()
    ctx.res?.setHeader("Content-Security-Policy", generateCSP({ nonce }))

    const styledComponentsSheet = new ServerStyleSheet()
    const additionalProps = { nonce }

    // let csp = `default-src 'self'; frame-src 'self'; frame-ancestors 'self'; form-action 'self'; style-src 'self' 'nonce-${nonce}';`
    // if (process.env.NODE_ENV !== "production") {
    //   csp = `default-src 'self'; frame-src 'self'; frame-ancestors 'self'; form-action 'self'; style-src 'self' 'unsafe-inline';`
    // }

    const sheetStyles = styledComponentsSheet.getStyleElement()
    const style =
      (sheetStyles &&
        React.Children.map(sheetStyles, (child) =>
          React.cloneElement(child, {
            nonce
          } as React.StyleHTMLAttributes<HTMLStyleElement>)
        )) ||
      null

    return {
      ...initialProps,
      ...additionalProps,
      styles: (
        <>
          {initialProps.styles}
          {style}
        </>
      ) as any
    }
  }

  render() {
    const { nonce } = this.props
    return (
      <Html className="govuk-template" lang="en">
        <Head nonce={this.props.nonce}>
          <script
            nonce={nonce}
            dangerouslySetInnerHTML={{
              __html: `window.__webpack_nonce__ = "${nonce}"`
            }}
          />
          <GovUkMetadata />
        </Head>

        <body className="govuk-template__body">
          <Main />
          <NextScript nonce={this.props.nonce} />
        </body>
      </Html>
    )
  }
}

export default GovUkDocument

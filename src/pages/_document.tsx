import { addBasePath } from "next/dist/shared/lib/router/router"
import Document, { Html, Head, Main, NextScript } from "next/document"

const GovUkMetadata = () => (
  <>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#0b0c0c" />

    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

    <link
      rel="shortcut icon"
      sizes="16x16 32x32 48x48"
      href={addBasePath("/images/favicon.ico")}
      type="image/x-icon"
    />
    <link rel="mask-icon" href={addBasePath("/images/govuk-mask-icon.svg")} color="#0b0c0c" />
    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href={addBasePath("/images/govuk-apple-touch-icon-180x180.png")}
    />
    <link
      rel="apple-touch-icon"
      sizes="167x167"
      href={addBasePath("/images/govuk-apple-touch-icon-167x167.png")}
    />
    <link
      rel="apple-touch-icon"
      sizes="152x152"
      href={addBasePath("/images/govuk-apple-touch-icon-152x152.png")}
    />
    <link rel="apple-touch-icon" href={addBasePath("/images/govuk-apple-touch-icon.png")} />

    <meta property="og:image" content={addBasePath("/images/govuk-opengraph-image.png")} />
  </>
)

class GovUkDocument extends Document {
  render() {
    return (
      <Html className="govuk-template" lang="en">
        <Head>
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

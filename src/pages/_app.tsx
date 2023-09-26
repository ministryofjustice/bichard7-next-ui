import { MSW_MOCKING } from "config"
import type { AppProps } from "next/app"
import { useEffect } from "react"
import "../../styles/globals.scss"

if (MSW_MOCKING === "enabled") {
  require("../../test/mock-service-worker")
}

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.body.className = document.body.className ? `${document.body.className} js-enabled` : "js-enabled"

    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    const GovUkFrontend = require("govuk-frontend")
    GovUkFrontend.initAll()
  }, [])
  return <Component {...pageProps} />
}

export default MyApp

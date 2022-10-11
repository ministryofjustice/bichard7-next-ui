// Transpile some modules which use modern syntax to make them compatible with legacy browsers
const withTM = require("next-transpile-modules")(["hex-rgb", "is-plain-obj"])

const nextConfig = {
  basePath: "/bichard",
  assetPrefix: "/bichard/",
  reactStrictMode: true
}

module.exports = withTM(nextConfig)

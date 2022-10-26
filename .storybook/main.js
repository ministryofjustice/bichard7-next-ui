const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")
const path = require("path")

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-addon-designs",
    "storybook-addon-next-router",
    {
      name: "storybook-addon-next",
      options: {
        nextConfigPath: path.resolve(__dirname, "../next.config.js")
      }
    }
  ],
    sassOptions: {
    includePaths: [path.join(__dirname, "styles")]
  },
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-webpack5"
  },
  features: {
    interactionsDebugger: true
  },
  typescript: {
    reactDocgen: false
  },
  webpackFinal: async (config) => {
    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions
      })
    ]
    return config
  }
}
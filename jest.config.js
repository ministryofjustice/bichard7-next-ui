module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePathIgnorePatterns: ["node_modules"],
  moduleNameMapper: {
    "^types/(.*)$": "<rootDir>/src/types/$1",
    "^lib/(.*)$": "<rootDir>/src/lib/$1"
  }
}

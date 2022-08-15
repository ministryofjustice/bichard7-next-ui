module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  modulePathIgnorePatterns: ["node_modules"],
  moduleNameMapper: {
    "^types/(.*)$": "<rootDir>/src/types/$1",
    "^lib/(.*)$": "<rootDir>/src/lib/$1",
    "^utils(.*)$": "<rootDir>/src/utils/$1",
    "^entities/(.*)$": "<rootDir>/src/entities/$1",
    "^services/(.*)$": "<rootDir>/src/services/$1"
  }
}

module.exports = {
  preset: "@react-native/jest-preset",
  testMatch: ["<rootDir>/tests/**/*.test.[jt]s?(x)"],
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/types/**"],
  coverageProvider: "v8",
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};

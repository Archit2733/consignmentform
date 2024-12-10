module.exports = {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["@testing-library/jest-dom"],
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest",
    },
  };
  
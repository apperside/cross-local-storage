module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["./src"],
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
    "tests/(.*)": "<rootDir>/__tests__/$1",
  },
  moduleNameMapper: {
    "\\.(eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileMock.js",
    ".+\\.(css|styl|less|sass|scss|png|gif|jpeg|jpg|ttf|woff|woff2)$":
      "identity-obj-proxy",
  },
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
  coverageReporters: [
    "json",
    "json-summary",
    "text",
    "lcov",
    "text-summary",
    "cobertura",
  ],
};


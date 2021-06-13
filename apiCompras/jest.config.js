module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: [
      "/node_modules"
    ],
    verbose: true,
    testMatch: ['<rootDir>/__test__/**/*.test.ts']
  };
  
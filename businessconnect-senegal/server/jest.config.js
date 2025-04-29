/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/src/**/*.test.ts'
  ],
  transform: {
    '^.+\\.ts$': ['ts-jest']
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  verbose: true
}; 
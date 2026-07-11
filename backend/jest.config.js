/** @type {import('jest').Config} */
module.exports = {
  preset:       'ts-jest',
  testEnvironment:'node',
  roots:        ['<rootDir>/src'],
  testMatch:    ['**/*.{test,spec}.ts'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
}

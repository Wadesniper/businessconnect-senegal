import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/businessconnect-senegal/server/src'],
  testMatch: [
    '**/__tests__/**/*.unit.+(ts|tsx)',
    '**/?(*.)+(spec|test).unit.+(ts|tsx)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover'],
  collectCoverageFrom: [
    'businessconnect-senegal/server/src/**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**'
  ],
  verbose: true,
  testTimeout: 10000,
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  }
};

export default config; 
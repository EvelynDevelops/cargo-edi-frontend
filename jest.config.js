/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1',
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    transform: {
      '^.+\\.(ts|tsx)$': ['ts-jest', {
        tsconfig: 'tsconfig.json',
      }],
    },
    testMatch: ['**/*.test.ts', '**/*.test.tsx'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  };
  
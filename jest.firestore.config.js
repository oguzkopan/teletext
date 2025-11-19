module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/firestore-rules.test.ts'],
  globals: {
    'ts-jest': {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    },
  },
  setupFiles: ['<rootDir>/jest.firestore.setup.js'],
};

const jestPreset = require('react-native/jest-preset');

module.exports = Object.assign(jestPreset, {
  transformIgnorePatterns: [
    ...jestPreset.transformIgnorePatterns,
    'node_modules/(?!(react-native.*|@?react-navigation.*)/)',
  ],
  setupFilesAfterEnv: [require.resolve('./dist/preset/setup.js')],
});
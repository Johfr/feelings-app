module.exports = {
  testEnvironment: 'jest-environment-jsdom',
//   testEnvironmentOptions: {
//     customExportConditions: ["node", "node-addons"],
//  },
 moduleNameMapper: {
  "^@vue/test-utils": "<rootDir>/node_modules/@vue/test-utils/dist/vue-test-utils.cjs.js"
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.vue$': '@vue/vue3-jest',
  },
  moduleFileExtensions: ['js', 'json', 'vue'],
  transformIgnorePatterns: ['/node_modules/'],
};

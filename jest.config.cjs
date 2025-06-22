module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',

    transform: {
        // Vue SFCs → vue3-jest
        '^.+\\.vue$': '@vue/vue3-jest',
        // TS/JS → ts-jest with our spec tsconfig
        '^.+\\.(ts|js)$': ['ts-jest', { tsconfig: 'tsconfig.spec.json' }]
    },

    // Force the CommonJS build of @vue/test-utils (no global Vue expected)
    moduleNameMapper: {
        // match the package import
        '^@vue/test-utils$': '<rootDir>/node_modules/@vue/test-utils/dist/vue-test-utils.cjs.js',
        // in case Jest picks up the browser build directly
        '^@vue/test-utils/dist/vue-test-utils.browser.js$':
            '<rootDir>/node_modules/@vue/test-utils/dist/vue-test-utils.cjs.js'
    },

    moduleFileExtensions: ['ts', 'js', 'vue', 'json'],
    testMatch: ['**/tests/unit/**/*.spec.ts']
}

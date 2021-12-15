/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
    preset: "ts-jest",
    testMatch: ["<rootDir>/test/*.(spec|test).ts?(x)"],
    "transform": {
        "^.+\\.[t|j]sx?$": "babel-jest"
    },
    // 下面非要从重要, 将不忽略 lodash-es, other-es-lib 这些es库, 从而使babel-jest去处理它们
    transformIgnorePatterns: ["<rootDir>/node_modules/(?!(lodash-es|other-es-lib))"]
};
// jest.config.js
module.exports = {
    testEnvironment: 'node',
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    moduleNameMapper: {
      '^axios$': '<rootDir>/mock/axios.js',
    },
    extensionsToTreatAsEsm: ['.js', '.jsx'],
    testMatch: ['<rootDir>/tests/*.test.js', '!<rootDir>/tests/axios.js'], 
};

  
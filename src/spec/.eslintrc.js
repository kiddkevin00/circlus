module.exports = {
  env: {
    jasmine: false,
    mocha: true,
  },
  globals: {
    expect: true,
    spy: true,
    stub: true,
    mock: true,
    match: true,
    pending: true,
  },
  plugins: [
    'chai-expect',
  ],
  rules: {
    'prefer-arrow-callback': 0,
    'chai-expect/missing-assertion': 2,
    'chai-expect/no-inner-compare': 2,
    'chai-expect/terminating-properties': 2,
  },
};

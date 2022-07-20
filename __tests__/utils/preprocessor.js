module.exports = {
  process(src, path) {
    return {
      code: src.replace(/module\.hot/g, 'global.mockModule.hot'),
    };
  },
};

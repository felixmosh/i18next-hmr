module.exports = {
  process(src, path) {
    return src.replace(/module\.hot/g, 'global.mockModule.hot');
  },
};

module.exports = {
  process(src, path) {
    return {
      code: src
        .replace(/module\.hot/g, 'global.mockModule.hot')
        .replace(/import\.meta\.hot/g, 'global.mockImport.meta.hot'),
    };
  },
};

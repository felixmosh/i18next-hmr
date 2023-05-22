module.exports = function (content) {
  this.query.localesDirs.forEach((dir) => this.addContextDependency(dir));
  return (
    content.replace(`'__PLACEHOLDER__'`, JSON.stringify(this.query.getChangedLang())) +
    '//' +
    new Date().getTime()
  );
};

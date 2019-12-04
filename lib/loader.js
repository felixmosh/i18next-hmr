module.exports = function(content) {
  this.addContextDependency(this.query.localesDir);
  return (
    content.replace(`'__PLACEHOLDER__'`, JSON.stringify(this.query.getChangedLang())) +
    '//' +
    new Date().getTime()
  );
};

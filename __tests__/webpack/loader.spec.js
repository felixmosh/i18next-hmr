const loader = require('../../lib/webpack/loader');

describe('loader', () => {
  let context;
  const options = ['en/namespace'];
  const query = {
    getChangedLang: jest.fn().mockImplementation(() => options),
    localesDirs: ['locals-dir'],
  };
  const content = `module.exports = '__PLACEHOLDER__';`;

  beforeEach(() => {
    context = {
      addContextDependency: jest.fn(),
      query,
    };
  });

  it('should add localesDir as context dependency', () => {
    loader.apply(context, [content]);
    expect(context.addContextDependency).toHaveBeenCalledWith(query.localesDirs[0]);
  });

  it('should add all locale dirs as context dependency', () => {
    query.localesDirs = ['folder1', 'folder2'];
    loader.apply(context, [content]);

    expect(context.addContextDependency).toHaveBeenCalledTimes(query.localesDirs.length);
    expect(context.addContextDependency).toHaveBeenCalledWith(query.localesDirs[0]);
    expect(context.addContextDependency).toHaveBeenCalledWith(query.localesDirs[1]);
  });

  it('should inject an object', () => {
    expect(loader.apply(context, [content])).toContain(JSON.stringify(options));
  });

  it('should invalidate content hash', async () => {
    const firstCall = loader.apply(context, [content]);
    await new Promise((resolve) => setTimeout(() => resolve(), 10));
    const secondCall = loader.apply(context, [content]);
    expect(firstCall).not.toEqual(secondCall);
  });
});

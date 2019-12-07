const loader = require('../lib/loader');

describe('loader', () => {
  let context;
  const options = {
    lang: 'en',
    ns: 'namespace',
  };
  const query = {
    getChangedLang: jest.fn().mockImplementation(() => options),
    localesDir: 'locals-dir',
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
    expect(context.addContextDependency).toHaveBeenCalledWith(query.localesDir);
  });

  it('should inject an object', () => {
    expect(loader.apply(context, [content])).toContain(JSON.stringify(options));
  });

  it('should invalidate content hash', async () => {
    const firstCall = loader.apply(context, [content]);
    await new Promise(resolve => setTimeout(() => resolve(), 10));
    const secondCall = loader.apply(context, [content]);
    expect(firstCall).not.toEqual(secondCall);
  });
});

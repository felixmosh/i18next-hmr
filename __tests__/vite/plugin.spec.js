const { i18nextHMRPlugin } = require('../../lib/vite/plugin');

function initPlugin({ localesDir, localesDirs, root = '/root', platform = process.platform } = {}) {
  if (process.platform !== platform) {
    Object.defineProperty(process, 'platform', {
      value: platform,
    });
  }

  const plugin = i18nextHMRPlugin({ localesDir, localesDirs });
  plugin.configResolved({
    root,
  });

  return plugin;
}

function triggerHotUpdateWith({ file }, plugin) {
  const mockServer = {
    ws: {
      send: jest.fn(),
    },
  };

  plugin.handleHotUpdate({ file, server: mockServer });

  return mockServer;
}

describe('Vite - plugin', () => {
  let plugin;
  let originalPlatform;
  beforeEach(() => {
    originalPlatform = process.platform;
    plugin = initPlugin();
  });

  afterEach(() => {
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
    });
  });

  if (process.platform !== 'win32') {
    it('should support localesDir as absolute path', () => {
      const plugin = initPlugin({ localesDir: '/absolute/path/to/locales' });
      const mockServer = triggerHotUpdateWith(
        { file: '/absolute/path/to/locales/en.json' },
        plugin
      );

      expect(mockServer.ws.send).toHaveBeenCalledWith('i18next-hmr:locale-changed', {
        changedFiles: ['en'],
      });
    });

    it('should support localesDir as relative path', () => {
      const plugin = initPlugin({ localesDir: './public/locales' });
      const mockServer = triggerHotUpdateWith({ file: '/root/public/locales/en.json' }, plugin);

      expect(mockServer.ws.send).toHaveBeenCalledWith('i18next-hmr:locale-changed', {
        changedFiles: ['en'],
      });
    });

    it('should support localesDirs as absolute path', () => {
      const plugin = initPlugin({ localesDirs: ['/absolute/path/to/locales'] });
      const mockServer = triggerHotUpdateWith(
        { file: '/absolute/path/to/locales/en.json' },
        plugin
      );

      expect(mockServer.ws.send).toHaveBeenCalledWith('i18next-hmr:locale-changed', {
        changedFiles: ['en'],
      });
    });

    it('should support localesDirs as relative path', () => {
      const plugin = initPlugin({ localesDirs: ['./public/locales'] });
      const mockServer = triggerHotUpdateWith({ file: '/root/public/locales/en.json' }, plugin);

      expect(mockServer.ws.send).toHaveBeenCalledWith('i18next-hmr:locale-changed', {
        changedFiles: ['en'],
      });
    });

    it('should process.cwd if root is not specified', () => {
      const plugin = initPlugin({ localesDirs: ['./public/locales'], root: '' });
      const mockServer = triggerHotUpdateWith(
        { file: `${process.cwd()}/public/locales/en.json` },
        plugin
      );

      expect(mockServer.ws.send).toHaveBeenCalledWith('i18next-hmr:locale-changed', {
        changedFiles: ['en'],
      });
    });

    it('should support namespaces', () => {
      const plugin = initPlugin({ localesDirs: ['./public/locales'], root: '/root' });
      const mockServer = triggerHotUpdateWith(
        { file: '/root/public/locales/namespace/en.json' },
        plugin
      );

      expect(mockServer.ws.send).toHaveBeenCalledWith('i18next-hmr:locale-changed', {
        changedFiles: ['namespace/en'],
      });
    });
  } else {
    it('should support localesDir as absolute path', () => {
      const plugin = initPlugin({ localesDir: 'C:\\project\\public\\locales' });
      const mockServer = triggerHotUpdateWith(
        { file: 'C:/project/public/locales/en.json' },
        plugin
      );

      expect(mockServer.ws.send).toHaveBeenCalledWith('i18next-hmr:locale-changed', {
        changedFiles: ['en'],
      });
    });

    it('should support localesDir as relative path', () => {
      const plugin = initPlugin({ localesDir: '.\\public\\locales', root: 'C:\\project' });
      const mockServer = triggerHotUpdateWith(
        { file: 'C:/project/public/locales/en.json' },
        plugin
      );

      expect(mockServer.ws.send).toHaveBeenCalledWith('i18next-hmr:locale-changed', {
        changedFiles: ['en'],
      });
    });

    it('should support localesDirs as absolute path', () => {
      const plugin = initPlugin({ localesDirs: ['C:\\project\\public\\locales'] });
      const mockServer = triggerHotUpdateWith(
        { file: 'C:/project/public/locales/en.json' },
        plugin
      );

      expect(mockServer.ws.send).toHaveBeenCalledWith('i18next-hmr:locale-changed', {
        changedFiles: ['en'],
      });
    });

    it('should support localesDirs as relative path', () => {
      const plugin = initPlugin({ localesDirs: ['.\\public\\locales'], root: 'C:\\project' });
      const mockServer = triggerHotUpdateWith(
        { file: 'C:/project/public/locales/en.json' },
        plugin
      );

      expect(mockServer.ws.send).toHaveBeenCalledWith('i18next-hmr:locale-changed', {
        changedFiles: ['en'],
      });
    });

    it('should process.cwd if root is not specified', () => {
      const plugin = initPlugin({ localesDirs: ['.\\public\\locales'], root: '' });
      const mockServer = triggerHotUpdateWith(
        { file: `${process.cwd().replace(/\\/g, '/')}/public/locales/en.json` },
        plugin
      );

      expect(mockServer.ws.send).toHaveBeenCalledWith('i18next-hmr:locale-changed', {
        changedFiles: ['en'],
      });
    });

    it('should support namespaces', () => {
      const plugin = initPlugin({ localesDirs: ['.\\public\\locales'], root: 'C:\\root' });
      const mockServer = triggerHotUpdateWith(
        { file: 'C:/root/public/locales/namespace/en.json' },
        plugin
      );

      expect(mockServer.ws.send).toHaveBeenCalledWith('i18next-hmr:locale-changed', {
        changedFiles: ['namespace/en'],
      });
    });
  }
});

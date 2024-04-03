const rspack = require('@rspack/core');
const path = require('node:path');
const refreshPlugin = require('@rspack/plugin-react-refresh');
const { I18NextHMRPlugin } = require('i18next-hmr/webpack');
const isDev = process.env.NODE_ENV === 'development';
/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
  context: __dirname,
  entry: {
    main: './src/main.tsx',
  },
  resolve: {
    extensions: ['...', '.ts', '.tsx', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: 'asset',
      },
      {
        test: /\.(jsx?|tsx?)$/,
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              sourceMap: true,
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                    development: isDev,
                    refresh: isDev,
                  },
                },
              },
              env: {
                targets: ['chrome >= 87', 'edge >= 88', 'firefox >= 78', 'safari >= 14'],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new rspack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new rspack.ProgressPlugin({}),
    new rspack.HtmlRspackPlugin({
      template: './index.html',
    }),
    isDev ? new refreshPlugin() : null,
    isDev ? new I18NextHMRPlugin({ localesDir: path.resolve('./public/locales') }) : null,
  ].filter(Boolean),
  devServer: {
    static: {
      directory: path.resolve('./public'),
      watch: {
        ignored: /\/public\/locales\//,
      },
    },
  },
};

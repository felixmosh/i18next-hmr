interface VitePlugin {
  name: string;
}
export declare function I18NextHMRPlugin(
  options: { localesDir: string } | { localesDirs: string[] }
): VitePlugin;

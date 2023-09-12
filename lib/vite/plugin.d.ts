interface VitePlugin {
  name: string;
}
export declare function i18nextHMRPlugin(
  options: { localesDir: string } | { localesDirs: string[] }
): VitePlugin;

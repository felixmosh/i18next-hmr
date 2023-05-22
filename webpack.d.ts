export declare class I18NextHMRPlugin {
  static addListener(cb: (data: { lang: string; ns: string }) => void): void;

  constructor(options: { localesDir: string; } | { localesDirs: string[] });
}


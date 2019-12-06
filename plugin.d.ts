export class I18nextHMRPlugin {
  static addListener(cb: (data: { lang: string; ns: string }) => void): void;

  constructor(options: { localesDir: string });
}
